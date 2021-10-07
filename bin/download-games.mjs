#!/usr/bin/env zx

const gameIds = await fs.readJson('./game_ids.json') // eslint-disable-line
await $`echo "game_id,timestamp,status,ruleset,outcome,death_turn,death_reason,death_by" > games.csv`

for (const g of gameIds) {
  const {game_id, you_id, Timestamp} = g
  const gameUrl = `https://engine.battlesnake.com/games/${game_id}`
  const opts = {
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  }
  const gameRes = await fetch(gameUrl, opts) // eslint-disable-line
  const gameResText = await gameRes.text()
  const game = JSON.parse(gameResText)
  
  const me = game.LastFrame.Snakes.find(snake => snake.ID === you_id)
  let output = {status: game.Game.Status, ruleset: game.Game.Ruleset.name}

  if (me.Death === null) {
    output.outcome = 'win'
  } else {
    output.outcome = 'loss'
    output.death_turn = me.Death.Turn
    output.death_cause = me.Death.Cause
    output.death_by = me.Death.EliminatedBy
  }

  await $`echo ${game_id},${Timestamp},${output.status},${output.ruleset},${output.outcome},${output.death_turn},${output.death_cause},${output.death_by} >> games.csv`
  
  // slow down so not to attract attention
  await sleep(1005)
}