import { Factory, Pool } from "../../generated/schema";
import { RWAPool } from "../../generated/templates";
import { PoolCreated as PoolCreatedEvent} from "../../generated/RWAFactory/RWAFactory";
import { BigInt } from "@graphprotocol/graph-ts";
export function handlePoolCreated(event:PoolCreatedEvent): void {
    let factorId = event.address;
    let factory = Factory.load(factorId)
    if (factory === null) {
        factory = new Factory(factorId)
        factory.poolCount = BigInt.fromI64(0)
    }

    let pool = new Pool(event.params.pool)
    factory.poolCount =factory.poolCount.plus(BigInt.fromI64(1))

    factory.save()
    pool.save();
    // Start indexing newly deployed template pool.
    RWAPool.create(event.params.pool);
}
