# download-games.mjs

```
cat > game_ids.json <<EOF
[{"game_id":"e7479bd3-e1ed-46fc-b4d7-ea26ec7f965b","you_id":"gs_QxrmCBGGJvrfm48XprRCgkpQ"},{"game_id":"8fcd020c-8bed-4ac6-afe7-d4dc421b4fd8","you_id":"gs_VPBryB44St6mdjj3BWtDgjxG"}]
EOF

npm i -g zx
brew install jq
brew install q

./download-games.mjs

q -H -d "," "select death_reason,count(game_id) from ./games.csv where outcome = 'loss' group by death_reason order by count(game_id) desc"
head-collision,43
out-of-health,31
snake-self-collision,16
wall-collision,6
snake-collision,3
```

