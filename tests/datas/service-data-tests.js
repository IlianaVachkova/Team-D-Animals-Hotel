/* globals require describe it beforeEach afterEach*/

const chai = require("chai");
const sinonModule = require("sinon");

let expect = chai.expect;

describe("Test service data", () => {
    let sinon;
    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    class Service {
        constructor(properties) {
            this.name = properties.name;
            this.detailedInfo = properties.detailedInfo;
            this.hotelId = properties.hotelId;
            this.isPerDay = properties.isPerDay;
            this.price = properties.price;
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

    let data=require("./../../server/data/service-data")({Service});

    describe("getById(id)", () => {
        let existingServiceId = 1;

        let service = {
            _id: existingServiceId,
            name: "Walk"
        };

        let services = [service];

        beforeEach(() => {
            sinon.stub(Service, "findOne", (query, callback) => {
                let id = query._id;
                let foundService = services.find(p => p._id === id);
                callback(null, foundService);
            });
        });

        afterEach(() => {
            Service.findOne.restore();
        });

        it("Expect to return the service", (done) => {
            data.getById(existingServiceId)
                .then((actualService) => {
                    expect(actualService).to.equal(service);
                    done();
                })
                .catch((err) => {});
        });

        it("Expect to return null, when no service with the id", (done) => {
            data.getById(138)
                .then((actualService) => {
                    expect(actualService).to.be.null;
                    done();
                })
                .catch((err) => {});
        });
    });

    describe("getAll()", () => {
        it("Expect to return 2 services", (done) => {
            //arrange
            let services = ["Tobbi", "Kitty"];
            sinon.stub(Service, "find", (_, cb) => {
                cb(null, services);
            });

            //act
            data.getAll()
                .then((actualServices) => {
                    //assert
                    expect(actualServices).to.eql(services);
                    done();
                })
                .catch((err) => {});
        });
    });

    describe("create(data)", () => {
        afterEach(() => {
            sinon.restore();
        });

        it("Expect to save the service", (done) => {
            sinon.stub(Service.prototype, "save", cb => {
                cb(null);
            });

            let name= "Walk";
            data.create(name, "something", "hotel_walk", true, 9)
                .then((actualService) => {
                    expect(actualService.name).to.equal(name);
                    done();
                })
                .catch((err) => {});
        });

        it("Expect to fail, when name is empty", (done) => {
            sinon.stub(Service.prototype, "save", cb => {
                cb(null);
            });

            let name = "";
            data.create(name, "something", "hotel_walk", true, 9)
                .catch(err => {
                    expect(err).not.to.be.null;
                    done();
                });
        });

        it("Expect to fail, when detailed info is empty", (done) => {
            sinon.stub(Service.prototype, "save", cb => {
                cb(null);
            });

            let detailedInfo = "";
            data.create("Walk", detailedInfo, "hotel_walk", true, 9)
                .catch(err => {
                    expect(err).not.to.be.null;
                    done();
                });
        });
    });
});