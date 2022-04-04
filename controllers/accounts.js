const { response } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const user = require('../models/user');
const { status } = require('express/lib/response');
const isAuth = require('./isAuth');
const Store = require('../models/store');


//Creat account
router.post('/creatAccount', async(req, res) => {
    //Get user inputs
    const { firsName, lastName, email, password, mobile } = req.body;
    //Check if user exist
    User.findOne({ email: email })
    .then(async account => {
        
        if(account) {
            
            return res.status(200).json({
                message: `User is alredy exist, please try other email`
            });
        } else {
            //Crypt password
            const formatted_password = await bcryptjs.hash(password, 10);
            //Generate passcode
            const passcode = generateRandomIntegerInRange(1000,9999);

            //Creat user in mongoDB
            const _user = new User({
                _id: mongoose.Types.ObjectId(),
                email: email,
                password : formatted_password,
                mobile: mobile,
                firstName: firsName,
                lastName: lastName,
                passcode: passcode
            })
            _user.save()
            .then(accountCreated => {
                return res.status(200).json({
                    message: accountCreated
                });
            })            
        }        
    })
    .catch(err => {
        
        return res.status(500).json({
            message: err
        });
    });    
    
    
    //Response  

});

//Login
router.post("/login", async (request, response) => {
    const { email, password } = request.body;
    User.findOne({ email: email })
      .then(async (user) => {
        if (user) {
          if (user.isApproved && !user.isLocked) {
            const isMatch = await bcryptjs.compare(password, user.password);
            if (isMatch) {
              //create token
              const acc_data = {
                firstName: user.firstName,
                lastName: user.lastName,
                Avatar: user.Avatar,
                mobile: user.mobile,
                email: user.email,
                _id: user._id,
              };
  
              const token = await jwt.sign(
                acc_data,
                "A6cXZ9Mj5hM4As2wiIugIz5DHNO3q1VF"
              );
  
              // response
              return response.status(200).json({
                msg: token,
              });
            } else {
              return response.status(200).json({
                msg: "your password is not match",
              });
            }
          } else {
            return response.status(200).json({
              msg: "your account is not approved",
            });
          }
        } else {
          return response.status(200).json({
            msg: "email not exist",
          });
        }
      })
      .catch((err) => {
        return response.status(200).json({
          msg: "user not found",
        });
      });
  });


router.post("/verify", async (req, res) => {
    // get passcode and email
    const { email, passcode } = req.body;
    // is user exists
    User.findOne({ email })
      .then(async (account) => {
        // verify code
        if (account) {
          if (account.passcode == passcode) {
            // update isApproved
            account.isApproved = true;
            account.save()
            .then((account_Update) => {
              return res.status(200).json({
                message: account_Update,
              });
            });
          } else {
            return res.status(200).json({
                message: "passcode not match",
            });
          }
        } else {
          // response
          return res.status(200).json({
            message: "user not found",
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({
            message: err,
        });
      });
  });


  //Forget Password

  router.post('/forgetPassword',(req, res) => {
    //Get user data
    const email = req.body.email;
    User.findOne({ email:email })
    .then(async account => {
      //Is user exist
      if(account){
        //Generate new passcode
        const newPasscode = generateRandomIntegerInRange(1000,9999);
        account.passcode = newPasscode;
        account.save()
        .then(account_Update => {
           //Response
          return res.status(200).json({
            message: account_Update.passcode
          });
        })
      } else {
        return res.status(200).json({
          message: "user not found",
        });
      }
    })
    .catch(err => {
      return response.status(500).json({
        message: err
      });
    })
  })

  //verifyRecover

  router.post("/verifyRecover", async (req, res) => {
    // get passcode and email
    const { email, passcode } = req.body;
    // is user exists
    User.findOne({ email: email })
      .then(async (account) => {
        // verify code
        if (account) {
          if (account.passcode == passcode) {
            // Response
              return res.status(200).json({
                message: "Passcode match",
              });
            
          } else {
            return res.status(200).json({
                message: "passcode not match",
            });
          }
        } else {
          // response
          return res.status(200).json({
            message: "user not found",
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({
            message: err,
        });
      });
  });

  //Update password

  router.post('/updatePassword', async (req, res) => {4
    //Get user input
    const { email, password } = req.body;
    User.findOne({ email: email })
    .then(async account => {
      //Is user exist
      if(account){
        //encrypt user password
        const formatted_password = await bcryptjs.hash(password, 10);
        //update new encrypt pass in mongodb
        account.password = formatted_password;
        account.save()
        .then(account_Update => {
          return res.status(200).json({
            message: account_Update
          })
        })
      } else {
        return res.status(200).json({
          message: 'User not found'
        })
      }
    })
    .catch(err => {
      return res.status(500).json({
        message: err
      })
    })
    
    
    
    //Response
  })

  router.get('/getUserData', isAuth, async(req, res) => {
    console.log(req.account);
    const userId = req.account._id
    const store = await Store.findOne({associateId : userId}).populate('associateId')
    return res.status(200).json({
      message: store
    })
  })

router.get('/sayHello', async(req,res) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            message: users
        });
    } catch (error) {
        console.log(error);
    }
    
});

function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = router;