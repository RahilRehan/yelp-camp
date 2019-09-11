var mongoose = require("mongoose");
var Campground = require("./models/campground");

data = [
    {
        name:"Salmon Creek",
        image:"https://pixabay.com/get/55e9d043485baa14f6da8c7dda793f7f1636dfe2564c704c73277ad6924ac05d_340.jpg",
        description:"This Place is full of salmon fishes and we enhoyed heck alot and we hadd a lot of fun......blah blah blah"
    },
    {
        name:"Forest Rest",
        image:"https://pixabay.com/get/57e4d64a4a54ad14f6da8c7dda793f7f1636dfe2564c704c73277ad6924ac05d_340.jpg",
        description:"r lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts "
    },
    {
        name:"Van Ground",
        image: "https://pixabay.com/get/57e8d7444251ae14f6da8c7dda793f7f1636dfe2564c704c73277ad6924ac05d_340.jpg",
        description:"m: usage Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place o"
    },
    {
        name:"River High",
        image:"https://pixabay.com/get/54e5d4414356a814f6da8c7dda793f7f1636dfe2564c704c73277ad6924ac05d_340.jpg",
        description:"In publishing and graphic design, lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying ..."
    }
]

function seedDB(){
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        else{
            //successfully removed campgrounds
            data.forEach(element => {
                Campground.create(element, function(err, data){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Campground Added");
                    }
                })
            });
        }
    })
}

module.exports = seedDB;