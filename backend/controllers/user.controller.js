const errorHandler = require("../helpers/dbErrorHandler");
const User = require("./../models/user.model");
const { DELETED_USER, UPDATED_USER } = require("../socket/eventMessages");
const formidable = require('formidable');
const fs = require('fs');


const create = async function (req, res, next) {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({
            success: true,
            message: "Successfully signed up"
        })
    } catch (error) {
        res.status(400).json({
            error: true,
            errors: err.message || "could not signup"
        });
    }
}
const list = async function (req, res) {
    try {

        let users = await User.find({})
            .select('name email followings followers updatedAt createdAt')
            .populate("followings", "_id name")
            .populate("followers", "_id name")

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            error: true,
            message: errorHandler.getError(error)
        });
    }
}
const userById = async function (req, res, next, id) {
    try {
        let user = await User.findById(id)
            .populate("followings", "_id name")
            .populate("followers", "_id name")
            
        if (!user)
            return res.status('400').json({
                error: true,
                message: "User not found"
            })
        req.profile = user;
        next();
    } catch (error) {
        res.status(400).json({
            error: true,
            message: "Can't retrieve user"
        })
    }
}
const read = function (req, res, next) {
    req.profile.salt = undefined;
    req.profile.password = undefined;
    return res.json({
        user: req.profile
    });
}
const update = async function (req, res, next) {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, async function (err, fields, files) {

        if (err) {
            return res.status(400).json({
                error: true,
                type: "imageUpload",
                message: "image couldn't be uploaded"
            })
        }
        let user = req.profile;


        user.name = fields.name || user.name;
        user.email = fields.email || user.email;
        user.password = fields.password || user.password;
        user.about = fields.about || user.about;
        user.createdAt = user.createdAt;
        user.updatedAt = Date.now();

        if (files.image) {
            user.image.data = fs.readFileSync(files.image.filepath)
            user.image.contentType = files.image.mimetype;
        }


        try {
            await user.save()

            user.salt = undefined;
            user.password = undefined;

            res.json({
                success: true,
                message: "User updated successfully",
                user
            });
        } catch (error) {
            res.status(400).json({
                error: true,
                errors: errorHandler.getError(error)
            });
        }

    })


}
const remove = async function (req, res, next) {
    try {
        let user = req.profile;
        let deleted = await User.deleteOne({ _id: user._id });

        // // broadcast deleted user event to all users
        // io.on("connection", function (socket) {
        //     socket.emit(DELETED_USER, { id: user._id });
        // })

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message || "Something went wrong"
        })
    }
}

const image = async function (req, res, next) {
    if (req.profile.image.data) {
        res.set("Content-Type", req.profile.image.contentType);
        return res.send(req.profile.image.data);
    }
    next();
}

const defaultImage = function (req, res, next) {
    let imagePath = process.cwd() + "/backend/public/images/user.png";
    return res.sendFile(imagePath);
}

///////////////// follw and unfollow /////////////////

const addFollowing = async function (req, res, next) {
    try {
        const { userId, followingId } = req.body;
        if (!userId || !followingId) {
            return res.status(400).json({
                error: true,
                message: "userId or followingId is required"
            })
        }
        await User.findByIdAndUpdate(userId,
            {
                $push: {
                    followings: followingId
                }
            })
        next()

    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: true,
            message: error
        });
    }
}
const addFollower = async function (req, res, next) {
    try {
        const { userId, followingId } = req.body;
        if (!userId || !followingId) {
            return res.status(400).json({
                error: true,
                message: "userId or followingId is required"
            })
        }
        let result = await User.findByIdAndUpdate(followingId,
            {
                $push: {
                    followers: userId
                }
            }, { new: true })
            .populate("followings", "_id name")
            .populate("followers", "_id name")
            .exec()

        result.password = undefined;
        result.salt = undefined;
        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        });
    }
}
const removeFollowing = async function (req, res, next) {
    try {
        const { userId, followingId } = req.body;
        if (!userId || !followingId) {
            return res.status(400).json({
                error: true,
                message: "userId or followingId is required"
            })
        }
        await User.findByIdAndUpdate(userId,
            {
                $pull: {
                    followings: followingId
                }
            })
        next()
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        });
    }
}


const removeFollower = async function (req, res, next) {
    try {
        const { userId, followingId } = req.body;
        if (!userId || !followingId) {
            return res.status(400).json({
                error: true,
                message: "userId or followingId is required"
            })
        }
        let result = await User.findByIdAndUpdate(followingId,
            {
                $pull: {
                    followers: userId
                }
            }, { new: true })
            .populate("followings", "_id name")
            .populate("followers", "_id name")
            .exec()

        result.password = undefined;
        result.salt = undefined;
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        });
    }
}

const findPeople = async function (req, res, next) {
    try {
        let user = req.profile;

        let followings = user.followings;
        followings.push(user._id);

        let users = await User.find({
            _id: { $nin: followings }
        }).select("name");

        res.status(200).json(users);

    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        });
    }
}






///// helper //////
const checkFollowings = async function (req, res, next) {
    try {
        const { userId, followingId } = req.body;
        let user = await User.findById(userId);

        if (user.followings.includes(followingId)) {
            return res.status(400).json({
                error: true,
                message: `the id ${followingId} is already in the following list`
            })
        }

        next()
    } catch (error) {
        res.status(400).json({
            error: true,
            errors: error
        })
    }
}

const validate = function (req, res, next) {
    const { userId, followingId } = req.body;
    if (!userId || !followingId) {
        return res.status(400).json({
            error: true,
            message: "userId or followingId is required"
        })
    }
    next()
}



module.exports = {
    create, list, userById, read,
    update, remove, image, defaultImage,
    addFollowing, removeFollowing,
    addFollower, removeFollower, checkFollowings,
    findPeople, validate
};