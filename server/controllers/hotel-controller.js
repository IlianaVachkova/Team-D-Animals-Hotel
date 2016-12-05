"use strict";

const ServiceData = require("../data").service;
const HotelData = require("../data").hotel;
const UserData = require("../data").users;
const breedsData = require("../data/models/breeds");

function loadRegisterPage(req, res) {
    if (!req.isAuthenticated()) {
        return res.redirect("../auth/login");
    }
    var user = req.user;
    res.render("hotel/register", {
        breeds: breedsData,
        user: user
    });
}

function loadHotelAddServicePage(req, res) {
	var user = req.user;
	var hotel = req.hotel;
	res.render("hotel/add-service", {
		user: user
	});
}

function registerHotel(req, res) {
    if (!req.isAuthenticated()) {
        return res.redirect("../auth/login");
    }
    const body = req.body;
    var user = req.user;

    let newHotelData = {
        name: body.name,
        owner: user._id,
        address: body.address,
        phoneNumber: body.phoneNumber,
        species: body.species
    };
    HotelData   
        .create(newHotelData)
        .then((newHotel) => {
            let newHotelId = newHotel._id;
            let servicesLeftToAdd = body.service.length;
            for(var serviceId in body.service){
                var service = body.service[serviceId];
                let newServiceToAdd = {
                    name: service.name,
                    detailedInfo: service.detailedInfo,
                    isPerDay: service.isPerDay,
                    hotelId: newHotel._id,
                    price: service.price,
                };
                ServiceData
                    .create(newServiceToAdd)
                    .then((newService)  => {
                        HotelData   
                            .getById(newService.hotelId)
                            .then((hotelToUpdate) => {
                                hotelToUpdate.services.push(newService);//FKING ASYNCH S**Ts
                                HotelData.update(hotelToUpdate._id, { $set: { services: hotelToUpdate.services }})
                                    .then(()=>{
                                        servicesLeftToAdd--;
                                        if(servicesLeftToAdd === 0){
                                            HotelData   
                                                .getById(newHotelId)
                                                .then((thisHotel)=> {
                                                    res.send(thisHotel);
                                                });
                                        }
                                    })
                                    .catch((err) => {
                                        res.status(500).send(500, "Hotel update failed\r\n");
                                        res.end();
                                    });
                            })
                    })
                    .catch((err) => {
                        res.status(500);
                        res.send(500, "Service problem failed\r\n");
                        res.end();
                    });


                        // servicisToAdd.push(newService);
                        // var hotelUpdate = HotelData.get
                        // HotelData
                        //     .update(newHotel._id, newHotel)
                        //     .then((newHotel) => {
                        //         res.send(newHotel); //dont change till there is /hotel/info.pug 
                        //     })
                        //     .catch((err) => {
                        //         res.status(500).send(500, "Service problem failed\r\n");
                        //         res.end();
                        //     });;
                        // // then((servicisToAdd, servicisToAdd2) =>{
                        //     newHotel.services = servicisToAdd;
                            

                    
            }

            // newHotel.services = servicisToAdd;
            // HotelData
            //     .update(newHotel._id, newHotel)
            //     .then((newHotel) => {
            //         res.redirect(JSON.stringify(newHotel)); //dont change till there is /hotel/info.pug 
            //     })
            //     .catch((err) => {
            //         res.status(500).send(500, "Service problem failed\r\n");
            //         res.end();
            //     });;
        })
        .catch((err) => {
            res.status(500).send(500, "Registration failed\r\n");
            res.end();
        });

    //TODO: Update user (add new hotel to his list hotels)
}

function registerService(req, res) {
	if(!req.isAuthenticated()){
		return res.redirect("../auth/login");
	}
	const body = req.body;
	var user = req.user;
		
	let newServiceData = {
		name: body.name,
		hotelId: user._id,
		price: body.price,
		isPerDay: body.isPerDay
	};

	ServiceData
		.create(newServiceData)
		.then(() => {
			//TODO:redirect somewhere
			res.send(JSON.stringify(newServiceData));
		})
		.catch((err) => {
			res.status(500);
			//res.send(500, "Registration failed\r\n");
			res.end();
		});
	//TODO: Update user (add new hotel to his list hotels)
}

function getAllHotels(req, res) {
	HotelData.getAll()
		.then(hotels => {
			return res.render("hotel/list", {
				model: hotels,
				user: req.user
			});
		})
		.catch(err => {
			res.status(400);
			res.send("Cannot list all hotels");
			res.end();
		});
}

function getHotelById(req, res) {
	let id = req.params.id;

	HotelData.getById(id)
		.then(hotel => {
			return res.render("hotel/details", {
				model: hotel,
				user: req.user
			});
		})
		.catch(err => {
			res.status(400);
			res.send("Cannot get this hotel by Id");
			res.end();
		});
}

module.exports = {
    loadRegisterPage,
    loadHotelAddServicePage,
    registerHotel,
    registerService,
    getAllHotels,
    getHotelById,
};