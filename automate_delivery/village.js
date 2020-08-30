import {getRandomLocation} from "./robots_algorithm.js"

// Parcel is an object consisting of its current location and destination
// Parcel(location, address)

// Represents state of the village at the current moment
export class VillageState {
    constructor(currentPlace, parcels){
        this.currentPlace = currentPlace
        this.parcels = parcels
    }

    move(destination) {
        if (this.currentPlace === destination){
            return this
        }
        else {
            let parcels = this.parcels.map(parcel => {
                if (parcel.location === this.currentPlace){
                    return {location: destination, address: parcel.address}
                }
                return parcel
            }).filter(parcel => parcel.address !== parcel.location)
            return new VillageState(destination, parcels)
        }
    }
    // for generating the start condition
    static filledStart(graph, parcelsNum=5) {
        let parcels = []
        for (let i = 0; i < parcelsNum; i++) {
            let location, address
            location = getRandomLocation(Object.keys(graph))
            do {
                address = getRandomLocation(Object.keys(graph))
            } while (location == address)
            parcels.push({location, address})
        }
        return new VillageState("Alice's House", parcels)
    }
}