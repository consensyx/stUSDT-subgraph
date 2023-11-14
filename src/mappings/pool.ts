import { Subscribe, Redeem, SubscribeUser, RedeemUser } from "../../generated/schema";
import { BigInt, store } from "@graphprotocol/graph-ts";
import {
    SubscribeT1 as SubscribeT1Event,
    MintShares as MintSharesEvent,
    BurnShares as BurnSharesEvent,
    Redeem as RedeemEvent,
} from "../../generated/templates/RWAPool/RWAPool";

export const ZERO = BigInt.fromI64(0)

export function handleSubscribeT1(event: SubscribeT1Event): void {
    let subscribeId = event.address.concat(event.params.account)
    let subscribe = Subscribe.load(subscribeId)
    let subscribeUser = SubscribeUser.load(subscribeId)

    if (subscribe === null) {
        subscribe = new Subscribe(subscribeId)
    }

    if (subscribeUser === null) {
        subscribeUser = new SubscribeUser(subscribeId)
        subscribeUser.amount = ZERO;
    }

    subscribe.account = event.params.account
    subscribe.amount = event.params.amount

    subscribeUser.account = event.params.account
    subscribeUser.amount = subscribeUser.amount.plus(event.params.amount)
    subscribeUser.pool = event.address

    subscribe.save()
    subscribeUser.save()
}

export function handleMintShares(event: MintSharesEvent): void {
    let subscribeId = event.address.concat(event.params.account)
    let subscribeUser = SubscribeUser.load(subscribeId)

    if (subscribeUser === null) {
        subscribeUser = new SubscribeUser(subscribeId)
        subscribeUser.amount = ZERO;
    }

    subscribeUser.account = event.params.account
    subscribeUser.amount = subscribeUser.amount.minus(event.params.amount)
    subscribeUser.pool = event.address

    if (subscribeUser.amount.equals(ZERO)) {
        store.remove("SubscribeUser", subscribeId.toHexString());
    } else {
        subscribeUser.save()
    }
}

export function handleRedeem(event: RedeemEvent): void {
    let redeemId = event.address.concat(event.params.account)
    let redeem = Redeem.load(redeemId)
    let redeemUser = RedeemUser.load(redeemId)

    if (redeem === null) {
        redeem = new Redeem(redeemId)
    }
    
    if (redeemUser === null) {
        redeemUser = new RedeemUser(redeemId)
        redeemUser.shares = ZERO;
    }

    redeem.account = event.params.account
    redeem.shares = event.params.shares

    redeemUser.account = event.params.account
    redeemUser.shares = redeemUser.shares.plus(event.params.shares)
    redeemUser.pool = event.address

    redeem.save()
    redeemUser.save()
}

export function handleBurnShares(event: BurnSharesEvent): void {
    let redeemId = event.address.concat(event.params.account)
    let redeemUser = RedeemUser.load(redeemId)

    if (redeemUser === null) {
        redeemUser = new RedeemUser(redeemId)
        redeemUser.shares = ZERO;
    }

    redeemUser.account = event.params.account
    redeemUser.shares = redeemUser.shares.minus(event.params.shares)
    redeemUser.pool = event.address;

    if (redeemUser.shares.equals(ZERO)) {
        store.remove("RedeemUser", redeemId.toHexString());
    } else {
        redeemUser.save()
    }
}