const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');

let uuid;
(async () => {
  const { v4 } = await import('uuid');
  uuid = v4;
})();

async function createFood(req, res) {
 

  const fileUploadResult = await storageService.uploadFile(
    req.file.buffer,
    uuid()  // works after import is resolved
  );
  console.log(fileUploadResult);

  const foodItem = await foodModel.create({
    name: req.body.name,
    description: req.body.description,
    video: fileUploadResult.url,
    foodPartner: req.foodPartner._id
  })

  res.status(201).json({
    message: "food created successfully",
    food: foodItem
  })
}

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({})
    res.status(200).json({
        message: "Food item fetched successfully",
        foodItems
    })
}

async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const ifAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    });
    if (ifAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        });

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        });


        return res.status(200).json({
            message: "Food item unliked successfully"
        });
    }
    const like = await likeModel.create({
        user: user._id,
        food: foodId
    });

await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    });


    res.status(201).json({
        message: "Food item liked successfully",
        like
    });
}






async function saveFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const ifAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    }); 
    if (ifAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        });

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: -1 }
        });
        return res.status(200).json({
            message: "Food item unsaved successfully"
        });
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    });

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 }
    });
      
    res.status(201).json({
        message: "Food item saved successfully",
        save
    });
}




async function getSaveFood(req, res) {
  const user = req.user;
  const savedFoods = await saveModel.find({ user: user._id }).populate('food');

  res.status(200).json({
    message: "Saved food items fetched successfully",
    savedFoods
  });
}





module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSaveFood
};
