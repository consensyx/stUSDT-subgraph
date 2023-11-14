# stUSDT's Subgraph

This subgraph dynamically

- tracks all pool created by the stUSDT factory.
- tracks all pending subscribe user
- tracks all pending redeem user

## Setup
```
$ yarn install
```

```
$ graph codegen && graph build
```

```
$ graph deploy --studio your-subgraph-name
```

refer [creating-a-subgraph](https://thegraph.com/docs/en/developing/creating-a-subgraph/)
## Example Queries

The following GraphQL example can query all subscribe users and redeem users in the pending list.

```graphql
{
  subscribeUsers(first: 5) {
    id 
    account
    amount
  }
  
  redeemUsers(first: 5) {
    id 
    account
    shares
  }
}
```

To learn more GraphQL, checkout [graphql](https://graphql.org/) official document.
