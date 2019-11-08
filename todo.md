## Info
- attackResult ga pake, pakenya attack aja kosong berarti dah kalah
- [referensi warna](https://logobly.com/blog/color-combinations/)
- standby command = saat user ga join game (inactive)
  - config saat di standby : change card/skill gitu
- personal command = user ada join game
  - config saat dah active : check hero stats, cek power(power untuk pake skill)
- card (damage single/multi, heal single/multi)

- new process mechanism
  - jadi pas preBattle, setiap user dikasih pilihan pilih dari random card
    pilih damage single/multi, heal single/multi
    card yg dipilih nambah chance setiap hero. setiap user uda adah chance
    chance nya ada, tapi masih 0%
    
- [referensi system chance](https://jsbin.com/gocojaraya/edit?js,console)
  

## Todo
- remake system damage
- pre making rpg system!
- personal command, dan standby command

## Done
- prototype done
- clean basenya sampai bener bener clean, ilangin unused code
- kasih flex play again di endgame
- kasih embel double kill, triple kill setelah battle state (func)
- kasih emoji emoji sama rapiin string
- mode team vs team
- buat detail attack (carousel) getPreBattleFlex
- use readFileSync aja deh
