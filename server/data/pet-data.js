/* globals require module Promise*/
"use strict";

module.exports = function(models) {
	let Pet = models.pet

	return {
		breeds(){
			return Pet.breedsData;
		},
		getById(id) {
			return new Promise((resolve, reject) => {
                Pet.findOne({_id: id }, (err, pet) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(pet || null);
                });
            });
		},
		getPets() {
            return new Promise((resolve, reject) => {
                Pet.find((err, pets) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(pets);
                });
            });
        },
		create(data) {
			return new Promise((resolve, reject) => {
				let pet = new Pet ({
					name: data.name,
					owner: data.owner,
					weight: data.weight,
					sex: data.sex,
					breed: data.breed,
					species: data.species,
					age: data.age
				});

				pet.save((err, createdPet) => {
					if (err) {
						return reject(err);
					}

					return resolve(createdPet);
				});
			});
		},
	};
};