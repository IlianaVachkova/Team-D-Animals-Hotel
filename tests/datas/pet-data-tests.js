/* globals require describe it beforeEach afterEach*/

const chai = require("chai");
const sinonModule = require("sinon");

let expect = chai.expect;

describe("Test pet data", () => {
    let sinon;
    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    class Pet {
        constructor(properties) {
            this.name = properties.name;
            this.owner = properties.owner;
            this.weight = properties.weight;
            this.sex = properties.sex;
            this.breed = properties.breed;
            this.species = properties.species;
            this.age = properties.age;
        }

        save() { }
        count() { }

        static find() { return this; }
        static findOne() { return this; }
        static findOneAndUpdate() { return this; }

        static select() { return this; }
        static exec() { return this; }
        static sort() { return this; }
        static limit() { return this; }
        static where() { return this; }
        static equals() { return this; }
        static skip() { return this; }
    }

    let data=require("./../../server/data/pet-data")({Pet});

    describe("getById(id)", () => {
        let existingPetId = 1;

        let pet = {
            _id: existingPetId,
            name: "Tobbi"
        };

        let pets = [pet];

        beforeEach(() => {
            sinon.stub(Pet, "findOne", (query, callback) => {
                let id = query._id;
                let foundPet = pets.find(p => p._id === id);
                callback(null, foundPet);
            });
        });

        afterEach(() => {
            Pet.findOne.restore();
        });

        it("Expect to return the pet", (done) => {
            data.getById(existingPetId)
                .then((actualPet) => {
                    expect(actualPet).to.equal(pet[0]);
                    done();
                })
                .catch((err) => {});
        });

        it("Expect to return null, when no pet with the id", (done) => {
            data.getById(138)
                .then((actualPet) => {
                    expect(actualPet).to.be.null;
                    done();
                })
                .catch((err) => {});
        });
    });

    describe("getPets()", () => {
        it("Expect to return 2 pet", (done) => {
            //arrange
            let pets = ["Tobbi", "Kitty"];
            sinon.stub(Pet, "find", (_, cb) => {
                cb(null, pets);
            });

            //act
            data.getPets()
                .then((actualPets) => {
                    //assert
                    expect(actualPets).to.eql(pets);
                    done();
                })
                .catch((err) => {});
        });
    });

    describe("create(data)", () => {
        afterEach(() => {
            sinon.restore();
        });

        it("Expect to save the pet", (done) => {
            sinon.stub(Pet.prototype, "save", cb => {
                cb(null);
            });

            let name= "Tobbi";
            data.create(name, "tobbi_owner", "0.33", "male", "dogs", "Akita", 9)
                .then((actualPet) => {
                    expect(actualPet.name).to.equal(name);
                    done();
                })
                .catch((err) => {});
        });

        it("Expect to fail, when name is empty", (done) => {
            sinon.stub(Pet.prototype, "save", cb => {
                cb(null);
            });

            let name = "";
            data.create(name, "tobbi_owner", "0.33", "male", "dogs", "Akita", 9)
                .catch(err => {
                    expect(err).not.to.be.null;
                    done();
                });
        });

        //other properties here
    });
});