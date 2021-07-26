# bobby witt

[Bobby Witt](https://play.battlesnake.com/u/tphummel/bobby-witt/) is my second [battlesnake](https://play.battlesnake.com). (below: light pink with rattler tail)

[![Alt text](/bobby-witt.gif)](https://play.battlesnake.com/g/81bdbe58-0229-49f4-9ef1-cf870b2fc616/)

## "Features"

- Will avoid the wall if possible.
- Won't make a terminal move if a non-terminal move is available.
- Will randomly chooses a non-terminal move if more than one is available.
- Will look one move ahead to avoid a move which is terminal one move later.
- Will not intentionally seek out food.
- Won't explicitly avoid head to head encounters.

## Notable things

- Battlesnake is super cool.
- I [deployed](https://bobby-witt-battlesnake.tomhummel.com) this snake using [Cloudflare Workers](https://workers.cloudflare.com/)
- I wrote [unit tests](/test.js) for various scenarios the snake may find itself in and what I expect it to do (or not do)
- I added the ability to [run the snake locally](/local.js) with node.js. It is very close to the same code which runs in cloudflare.

## Usage

run locally:
```
DEBUG=1 node local.js
```

curl example:

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"game":{"id":"f59488b9-b159-45b0-ae2e-221648b1aa58","timeout":500},"turn":35,"board":{"height":11,"width":11,"food":[{"x":10,"y":4},{"x":5,"y":5},{"x":4,"y":4},{"x":2,"y":5},{"x":6,"y":2},{"x":4,"y":2},{"x":4,"y":0},{"x":6,"y":6}],"hazards":[],"snakes":[{"id":"acb1e234-918c-421c-9a48-84f254fcf8bd","name":"acb1e234-918c-421c-9a48-84f254fcf8bd","health":66,"body":[{"x":1,"y":9},{"x":1,"y":8},{"x":1,"y":7}],"latency":0,"head":{"x":1,"y":9},"length":3,"shout":"","squad":""}]},"you":{"id":"acb1e234-918c-421c-9a48-84f254fcf8bd","name":"acb1e234-918c-421c-9a48-84f254fcf8bd","health":66,"body":[{"x":1,"y":9},{"x":1,"y":8},{"x":1,"y":7}],"latency":0,"head":{"x":1,"y":9},"length":3,"shout":"","squad":""}}' \
  http://localhost:8080
  ```

  play locally against a remote snake using the [battlesnake rules cli](https://github.com/BattlesnakeOfficial/rules):
  ```
  battlesnake play --viewmap --gametype duel --name local --url http://localhost:8080 --name cf --url https://battlesnake.tomhummel.com
  ```

## What does the name mean?

[Bobby Witt](https://www.baseball-reference.com/players/w/wittbo01.shtml) is a professional baseball player who has [walked alot of batters](https://stathead.com/tiny/YZutT). This snake has poor control.  
