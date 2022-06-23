const express = require("express");
const userCtrl = require("../controllers/user.controller");
const authCtrl = require("../controllers/auth.controller");

const router = express.Router();

router.route("/api/users")
    .get(userCtrl.list)
    .post(userCtrl.create)

router.route("/api/users/defaultimage")
    .get(userCtrl.defaultImage);


router.route("/api/users/follow")
    .put(
        userCtrl.validate,
        authCtrl.authenticate,
        authCtrl.requireSignin,
        userCtrl.checkFollowings,
        userCtrl.addFollowing,
        userCtrl.addFollower
    )

router.route("/api/users/unfollow")
    .put(
        userCtrl.validate,
        authCtrl.authenticate,
        authCtrl.requireSignin,
        userCtrl.removeFollowing,
        userCtrl.removeFollower
    )

router.route("/api/users/:userId")
    .get(authCtrl.authenticate, authCtrl.verify, userCtrl.read)
    .put(authCtrl.authenticate, authCtrl.authoriz, userCtrl.update)
    .delete(authCtrl.authenticate, authCtrl.authoriz, userCtrl.remove)

router.route("/api/users/:userId/image")
    .get(userCtrl.image, userCtrl.defaultImage);

router.route("/api/users/findpeople/:userId")
    .get(userCtrl.findPeople)

router.param("userId", userCtrl.userById);

module.exports = router;