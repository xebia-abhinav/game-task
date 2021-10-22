# Game of Three

## Start app

```
npm run dev
```

## APIs

### Start game

```
POST /start
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
POST /join
{
    "game":{{gameId}}
}
```

### Play turn

```
POST /play
{
    "game":{{gameId}},
    "choice": 1,
    "player": {{nextPlayer}}
}
```

### Game status

```
GET /stat/:gameId
```
