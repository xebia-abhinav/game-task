# Game of Three

## Start app

```
npm run dev
```

## APIs

### Start game

```
{
    "num": 29,
    "bot": {
        "p1": false,
        "p2": true
    }
}
```

### Join game

```
{
    "game":{{gameId}}
}
```

### Play turn

```
{
    "game":{{gameId}},
    "choice": 1,
    "player": {{nextPlayer}}
}
```
