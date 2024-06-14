function infAdd(x,y) {                 // Adds two infNumbers - for example, infAdd(1,0) returns 1.0414 (log(10+1)) 
    if (Math.abs(x-y)>16) {              // If the quotient of x and y is more than 1e+16, the addition is negligible
      return Math.max(x,y)
    } else {
      z = Math.min(x,y)
      return z+Math.log10(10**(x-z)+10**(y-z))
    }
  }
  function infSubtract(x,y) {            // Subtracts two infNumbers - if y is greater than x an error message is infoutput. For example, infSubtract(1,0) returns 0.9542 (log(10-1))
    if (x-y>16) {                        // If y is less than 1/1e+16 of x, the subtraction is negligible
      return x
    } else if (x==y) {                   // If x and y are equal, 1/1e+100 is infoutput instead of -Infinite.
      return -999
    } else if (y>x) {                    // If a negative value would be infoutput, 0 is infoutput instead as the library can't support negative numbers. However, the game has controls in place to make sure negative values never occur
      return 0
    } else {
      return x+Math.log10(1-10**(y-x))
    }
  }
  var notation="Mixed scientific"
  function infFormat(x,y) {
    if (isNaN(x)) return "NaN"
    if (x == -999) return 0
    if (x<-10) return 0
    if (x == Infinity) return 'Maxed out!'
    if (Math.abs(x)<3) return Math.round((y ? 10**Math.max(0,Math.min(5,2-Math.floor(x))) : 1)*10**x)/(y ? 10**Math.max(0,Math.min(5,2-Math.floor(x))) : 1)
    else if ((x<-99)&&(x>-101)) return 0
    m=(x>0)?"":"1 / "
    x=Math.abs(x)
    if (notation=="Alemaninc Ordinal") {
      infoutput="α<sub>"+(Math.floor(((x<10) ? 10*x : 100*(1+Math.log(x/10)*0.2)**5)-30).toLocaleString('en-US'))+"</sub>"
      return m+infoutput
    } else if (notation=="Double Logarithm") {
      return m+"ee"+Math.log10(x).toFixed(5)
    } else if (notation=="Engineering") {
      function preE_length(z) { // funxction to calculate length of Characters in front of floating point
        z=Math.abs(z)
        return m+(10 ** (z % 3) - ((10 ** (z % 3) % 1)) % 1).toString().length
      }
      var t = Math.log10(Math.abs(x)) // t only in use for (x>1e9)
      return m+((Math.abs(x) < 1e9)
        ? (10 ** (x % 3)).toFixed((preE_length(x) == 3) ? 1 : (preE_length(x) == 2) ? 2 : 3) // dynamic float
        + "e" + (x - (x % 3)).toLocaleString("en-US")
        : "e" + (10 ** (x % 3)).toFixed((preE_length(t) == 3) ? 1 : (preE_length(t) == 2) ? 2 : 3) // dynamic float
        + "e" + (t - (t % 3)).toLocaleString("en-US"));
    } else if (notation=="Infinity") {
      infoutput=Math.log(x)/308.25471555991675
      return m+(((infoutput>1e6)?((10**(x%1)).toFixed(2)+"e"+Math.floor(x).toLocaleString("en-US")):infoutput.toFixed(6))+"∞")
    } else if (notation=="Logarithm") {
      return m+((x<1e9) ? "e"+(x.toFixed((x>100000)?0:2)).toLocaleString('en-US') : "e"+Math.floor(100*10**(x%1))/100+"e"+Math.floor(Math.log10(x)))
    } else if (notation=="Mixed scientific") {
      const endings=["K","M","B","T","Qa","Qt","Sx","Sp","Oc","No","Dc","UDc","DDc","TDc","QaDc","QiDc","SxDc","SpDc","OcDe","NoDe"]
      return m+((x<0?"1 / ":"")+((x<60) ? (10**(x%3)).toFixed(2)+" "+endings[Math.floor(x/3)-1]                    // 3.5 = 3.16 K
      : (x<1e9) ? (10**(x%1)).toFixed(2)+"e"+Math.floor(x).toLocaleString("en-US")                                 // 38462.25 = 1.77e38,462
      : (x<1e33) ? "e"+(10**(Math.log10(x)%3)).toFixed(2)+" "+endings[Math.floor(Math.log10(x)/3)-1]               // 1.23e21 = e1.23 Sx
      : "e"+(x/10**Math.floor(Math.log10(x))).toFixed(2)+"e"+Math.floor(Math.log10(x)))) }
        else if (notation=="Scientific") {
      return m+((x<1e9) ? (10**(x%1)).toFixed(2)+"e"+Math.floor(x).toLocaleString("en-US") : "e"+(x/10**Math.floor(Math.log10(x))).toFixed(2)+"e"+Math.floor(Math.log10(x)))
    } else if (notation=="Tetration") {
      infoutput = 0
      while ((x>0.4342944819)&&(infoutput<5)) {
        x=(Math.log(x*Math.log(10))/Math.log(10))
        infoutput++
      }
      return m+"e ^^ "+(infoutput+(x*Math.log(10))).toFixed(6)
    } else if (notation=="Strange") {
        x=100-(100/Math.sqrt(x))
      return "Rng: "+x.toFixed(5)+'%'
    }
  }
  function normFormat(x) {
    if (x==0) return 0
    else if ((x>=1e6)||(x<=1e-6)) return infFormat(Math.log10(x))
    else if (x>=1000) return Math.round(x).toLocaleString("en-US")
    else if (Math.abs(x)>=100) return Math.round(x)
    else {
      precision=2+Math.max(0,-Math.floor(Math.log10(x)))
      return Math.round(x*10**precision)/10**precision
    }
  }
  function twoDigits(x) {
    return (x<10) ? "0"+Math.floor(x) : Math.floor(x)
  }
  function timeFormat(x) {
    return (x<1) ? Math.floor(x*1000)+" milliseconds" : (x<10) ? Math.floor(x*1000)/1000+" seconds" : (x<60) ? Math.floor(x)+" seconds" : (x<3600) ? Math.floor(x/60)+":"+twoDigits(Math.floor(x%60)) : (x<86400) ? Math.floor(x/3600)+":"+twoDigits(Math.floor(x/60)%60)+":"+twoDigits(Math.floor(x%60)) : Math.floor(x/86400)+" days "+Math.floor(x/3600)%24+":"+twoDigits(Math.floor(x/60)%60)+":"+twoDigits(Math.floor(x%60))
  }





  
  
  
  
  
  
  
  
  
  
  var game = {
    money: -999,
    gems: -999,
    currentlevel: 0,
    currentstage: 0,
    bestlevel: 0,
    beststage: 0,
    upgrade_selected: 0,
    smithing_power: 0,
    gem_chance: 5,
    dudsInARow: 0,
    quality: 0,
    picquality: 0,
    picpoints: 0,
    pointeff: 0,
    expecteddmg: 0,
    expectedquality: 0,
    logtext: '',
    autoclickerspeed: 0,
    autoclickercooldown: 100,
    autoclickerdmg: 0,
    gemwastercurrentlvl: 0,
    piccreateprice: 0,

    objmaxhp: 0,
    objhp: 0,
    objdef: 0,
    objreward: 0,
    damage: Math.log10(3),
    finaldamage: 0,

    U1_price: 0,
    U1_eff: 0,
    U1_lvl: 0,
    U2_price: 0,
    U2_eff: 0,
    U2_lvl: 0,
    U3_price: 0,
    U3_eff: 0,
    U3_lvl: 0,
    U4_price: 0,
    U4_eff: 0,
    U4_lvl: 0,
    U5_price: 0,
    U5_eff: 0,
    U5_lvl: 0,
    U6_price: 0,
    U6_eff: 0,
    U6_lvl: 0,
    U7_price: 0,
    U7_eff: 0,
    U7_lvl: 0,
    U8_price: 0,
    U8_eff: 0,
    U8_lvl: 0,
    U9_price: 0,
    U9_eff: 0,
    U9_lvl: 0,
    U10_price: 0,
    U10_eff: 0,
    U10_lvl: 0,

    factorylvl: 0,
    factoryxp: 0,
    factoryxpgain: 0,
    factoryreq: 0,
    factoryeff1: 0,
    factoryeff2: 0,
    factoryeff3: 0,

    miner1cost: 0,
    miner1amount: -999,
    miner1mult: 0,
    miner1bought: 0,
    miner2cost: 0,
    miner2amount: -999,
    miner2mult: 0,
    miner2bought: 0,
    miner3cost: 0,
    miner3amount: -999,
    miner3mult: 0,
    miner3bought: 0,
    miner4cost: 0,
    miner4amount: -999,
    miner4mult: 0,
    miner4bought: 0,

    offline_time: Date.now(),
    offline_money: 0,
    offline_xp: 0,
    offline_miner1: 0,
    offline_miner2: 0,
    offline_miner3: 0,
    offlinefactorylvls: 0,


    autostageprogress: false,
    autolevelprogress: false,
    showorenum: false,
    menu: 1,
    factoryunlocked: 0,

    achievements: [],
    achchosen: 1,
}
var offline_time = 0
function saveGame()
{
  localStorage.setItem("game-stuff", JSON.stringify(game))
  game.offline_time = Date.now()
  logEvent('Game saved!','blue')
}

var saveGameLoop = window.setInterval(function() {
  saveGame()
}, 15000)

function loadGame(){
  var savegame = JSON.parse(localStorage.getItem("game-stuff"))
  if (savegame !== null) {
    game = savegame
  }
  let something = Date.now()
  offline_time = something-game.offline_time
  
  if(offline_time>60000)
    {
      game.offline_miner3 = Math.log10(offline_time/1000)+(game.miner4amount-2)+game.miner4mult
      game.miner3amount = infAdd(game.miner3amount,game.offline_miner3)
      game.offline_miner2 = Math.log10(offline_time/1000)+(game.miner3amount-2)+game.miner3mult
      game.miner2amount = infAdd(game.miner2amount,game.offline_miner2)
      game.offline_miner1 = Math.log10(offline_time/1000)+(game.miner2amount-2)+game.miner2mult
      game.miner1amount = infAdd(game.miner1amount,game.offline_miner1)

      game.offline_xp = Math.log10(offline_time/1000)+game.miner1amount+game.miner1mult
      game.factoryxp = infAdd(game.factoryxp,game.offline_xp)
      game.offlinefactorylvls = 0
      while(game.factoryxp>game.factoryreq)
        {
          game.factoryxp = infSubtract(game.factoryxp,game.factoryreq)
          game.factorylvl ++
          game.offlinefactorylvls ++
          game.factoryreq = Math.log10(4)+3+Math.log10(3)*game.factorylvl
          if(game.factoryreq>6)
          {
            game.factoryreq *= 1+game.factorylvl/50
          }
          game.factoryeff1 = Math.log10(1.35)*game.factorylvl
        }
        if(game.currentlevel<5)
          {
              game.objreward = Math.log10(Math.floor(Math.pow(10,game.objmaxhp)/16.35))+game.U7_eff+game.factoryeff1
              game.objreward = Math.log10(Math.floor(Math.pow(10,game.objreward)/Math.pow(10,Math.floor(game.objreward)-2))*Math.pow(10,Math.floor(game.objreward)-2))
          }
          else
          {
              if(game.objreward<300)
                  {
                      game.objreward = (Math.log10(Math.floor(Math.pow(10,game.objmaxhp)*(0.25+Math.sqrt((game.currentlevel+game.currentstage)/3))))-1+game.U7_eff)*(1/((game.currentlevel+180)/180))+game.factoryeff1
                      if(game.objreward>30)
                        {
                          game.objreward = 30+((game.objreward-30)/1.3)
                        }
                      game.objreward = Math.log10(Math.floor(Math.pow(10,game.objreward)/Math.pow(10,Math.floor(game.objreward)-2))*Math.pow(10,Math.floor(game.objreward)-2))
                  }
                  else
                  {
                      game.objreward = game.objmaxhp+Math.log10(0.5+Math.sqrt((game.currentlevel+game.currentstage)/3))
                      if(game.objreward>30)
                        {
                          game.objreward = 30+((game.objreward-30)/1.3)
                        }
                  }
          }
      if(game.autoclickerdmg>game.objdef)
        {
          game.offline_money = Math.log10(offline_time/1000)+Math.log10(game.autoclickerspeed)+game.objreward+Math.log10(0.2)
        }
        else
        {
          game.offline_money = -999
        }
      game.money = infAdd(game.money,game.offline_money)
    }
  if(offline_time>60000)
    {
      logEvent('You were offline for '+timeFormat(offline_time/1000)+', generating '+infFormat(game.offline_money)+'$','blue')
      if(game.factoryunlocked == 1)
      {
      logEvent('Your workers also generated '+infFormat(game.offline_xp)+' XP, leveling up the factory '+game.offlinefactorylvls+' times.','blue')
      }
    }
    else
    {
      logEvent('You were offline for '+timeFormat(offline_time/1000)+'.','blue')
    }

  localStorage.setItem("game-stuff", JSON.stringify(game))
  logEvent('Game loaded!','blue')

  saveGame()
}

loadGame()

const orenames = ['Mud','Paper','Salt','Sand','Clay','Rock','Lead','Toxic mud','Coal','Iron','Quartz','Carbonite','Bones','Iron paper','Crystal','Spooky bones','Topaz','Amethyst','Bloody paper','Aquamarine','Ruby','Pure topaz','Chlorite bones','Gold','Diamond paper','Mithril','Obsidian','Drollium','Platinum','Pure platinum',
'Compressed obsidian','Orbium','Darkstone','Wind essence','Adamantite','Uranium crystal','Earth essence','Bone essence','Merillium','Water essence','Possium crystal','Fire essence','Demon bones','Unrealite','Ultimate essence','Glitch bones','Unobtanium','Mysterium','Cosmolite','Cursed bones','Eternium','Mysterious crystal','Demon rock lvl1',
'Demon rock lvl2','Demon rock lvl3','Demon rock lvl4','THE GEM','Demonite','True infinitium','Colorful essence','Power paper','Darkened essence','Holo-stone','Anti-mud','Quantum orb','The source of power','Essence of infinity','Unknownium','Aukrawtz','Gordolium orb','Berillam','Ouwrist gem','Postrit crystal','The paper of gods',
'Mysticite','Infinity crystal','Shadow essence','Omega essence','Soul stone','Ultimate orb','Absurdium','Zettawatt crystal','Aetherium','Nowaynium','Ultimate gem','THE PORTAL']

function tick()
{
    game.objmaxhp = Math.log10(40)+Math.log10(8.5)*game.currentlevel+Math.log10(1.2)*game.currentstage
    if(game.objmaxhp<60)
        {
    game.objmaxhp = Math.log10(Math.floor(Math.pow(10,game.objmaxhp)/Math.pow(10,Math.floor(game.objmaxhp)-2))*Math.pow(10,Math.floor(game.objmaxhp)-2))
        }

        if(game.currentlevel>85)
          {
            game.objmaxhp *= 1+((game.currentlevel-85)/100)
          }

    if(game.currentlevel<5)
    {
        game.objdef = Math.log10(Math.floor(Math.pow(10,game.objmaxhp)/24))
        game.objdef = Math.log10(Math.floor(Math.pow(10,game.objdef)/Math.pow(10,Math.floor(game.objdef)-2))*Math.pow(10,Math.floor(game.objdef)-2))
    }
    else
    {
        if(game.objdef<300)
            {
                game.objdef = infAdd(Math.log10(Math.floor(Math.pow(10,game.objmaxhp)/(600/Math.sqrt(game.currentlevel/7)))),Math.log10(50000))
                game.objdef = Math.log10(Math.floor(Math.pow(10,game.objdef)/Math.pow(10,Math.floor(game.objdef)-2))*Math.pow(10,Math.floor(game.objdef)-2))
            }
            else
            {
                game.objdef = infAdd(game.objmaxhp-Math.log10(600/Math.sqrt(game.currentlevel/7)),Math.log10(50000))
            }
    }
    if(game.currentlevel<5)
        {
            game.objreward = Math.log10(Math.floor(Math.pow(10,game.objmaxhp)/16.35))+game.U7_eff+game.factoryeff1
            game.objreward = Math.log10(Math.floor(Math.pow(10,game.objreward)/Math.pow(10,Math.floor(game.objreward)-2))*Math.pow(10,Math.floor(game.objreward)-2))
        }
        else
        {
            if(game.objreward<300)
                {
                    game.objreward = (Math.log10(Math.floor(Math.pow(10,game.objmaxhp)*(0.25+Math.sqrt((game.currentlevel+game.currentstage)/3))))-1+game.U7_eff)*(1/((game.currentlevel+180)/180))+game.factoryeff1
                    if(game.objreward>30)
                      {
                        game.objreward = 30+((game.objreward-30)/1.3)
                      }
                    game.objreward = Math.log10(Math.floor(Math.pow(10,game.objreward)/Math.pow(10,Math.floor(game.objreward)-2))*Math.pow(10,Math.floor(game.objreward)-2))
                }
                else
                {
                    game.objreward = game.objmaxhp+Math.log10(0.5+Math.sqrt((game.currentlevel+game.currentstage)/3))
                    if(game.objreward>30)
                      {
                        game.objreward = 30+((game.objreward-30)/1.3)
                      }
                }
        }
        game.finaldamage = (game.damage+game.U8_eff+game.pointeff)
        if(game.objdef>game.finaldamage)
          {
            game.finaldamage = -996
          }
          else
          {
            game.finaldamage = infSubtract((game.damage+game.U8_eff+game.pointeff),game.objdef)
          }
          game.autoclickerdmg = (game.damage+game.pointeff+game.U5_eff)
          if(game.objdef>game.finaldamage)
            {
              game.autoclickerdmg = -996
            }
            else
            {
              game.autoclickerdmg = infSubtract((game.damage+game.pointeff+game.U5_eff),game.objdef)
            }
        game.U1_price = 2+(game.U1_lvl-game.U10_eff)*Math.log10(1.245+(game.U1_lvl-game.U10_eff)/1600)
        if(game.U1_price>22)
          {
            game.U1_price += 3
          }
          if(game.U1_price>38)
            {
              game.U1_price += 3
            }
        game.U1_eff = Math.log10(game.U1_lvl+3)+Math.log10(1.11)*(game.U1_lvl+game.factoryeff2+game.U10_eff)
        game.U2_price = 4+game.U2_lvl*Math.log10(3.25)
        game.U2_eff = 2+Math.log10(1.1)*game.U2_lvl
        if(game.U2_eff>3)
          {
            game.U2_eff = 3+(game.U2_eff-3)*0.75
          }
        game.U3_price = 7+game.U3_lvl*Math.log10(300)
        if(game.U3_lvl>19)
          {
            game.U3_price = Infinity
          }
        if(game.dudsInARow<game.U3_lvl)
          {
            game.U3_eff = game.dudsInARow
          }
          else
          {
            game.U3_eff = game.U3_lvl
          }
        game.U4_price = 6+game.U4_lvl*Math.log10(3.45)
        if(game.U4_lvl>29)
          {
            game.U4_price = Infinity
          }
        game.U4_eff = game.U4_lvl*0.5
        game.gem_chance = 5+game.U4_eff
        game.U5_price = Math.log10(35000)+game.U5_lvl*Math.log10(1.235)
        game.U5_eff = Math.log10(0.75)+game.U5_lvl*Math.log10(1.067)
        game.U6_price = Math.log10(1.0e6)+game.U6_lvl*Math.log10(3.25)
        if(game.U6_lvl>19)
          {
            game.U6_price = Infinity
          }
        game.U6_eff = 0.5*(1.1**game.U6_lvl)
        game.U7_price = Math.log10(1.0e6)+game.U7_lvl*4
        game.U7_eff = Math.log10(2)*game.U7_lvl
        game.U8_price = Math.log10(2.25e5)+game.U8_lvl*Math.log10(1.37)
        game.U8_eff = Math.log10(1.1)*game.U8_lvl
        game.U9_price = Math.log10(1.0e9)+game.U9_lvl*Math.log10(4500)
        if(game.U9_lvl>6)
          {
            game.U9_price += 2
          }
          if(game.U9_lvl>8)
            {
              game.U9_price = Infinity
            }
        game.U9_eff = Math.log10(Math.floor(Math.pow(10,Math.log10(3.28732)*game.U9_lvl)))
        game.quality = game.U2_eff
        game.smithing_power = game.U1_eff+(game.quality-2)+game.piccreateprice
        game.pointeff = Math.log10(1.2)*game.picpoints
        game.autoclickerspeed = game.U6_eff
        game.autoclickercooldown -= game.autoclickerspeed
        if(game.autoclickercooldown<0)
          {
            game.autoclickercooldown = 100
            auto_mine_click()
          }
        game.piccreateprice = Math.log10(Math.floor(Math.pow(10,Math.log10(3.28732)*game.gemwastercurrentlvl)))
        game.factoryreq = Math.log10(4)+3+Math.log10(3)*game.factorylvl
        if(game.factoryreq>6)
          {
            game.factoryreq *= 1+game.factorylvl/50
          }
        game.factoryeff1 = Math.log10(1.35)*game.factorylvl
        if(game.factoryeff1>3)
        {
          game.factoryeff1 *= 1.2
        }
        if(game.factorylvl>28)
          {
            game.factoryeff1 *= 1.5
          }
        game.factoryeff2 = Math.floor(Math.pow(game.factorylvl, 1.5)*3)
        if(game.factoryeff2>49)
          {
            game.factoryeff2 = Math.floor(50+((game.factoryeff2-50)/2.5))
          }
        game.factoryeff3 = Math.log10(Math.floor(Math.pow((game.factorylvl+1),1.4)))
        if(game.factoryunlocked == 0 && game.money>22)
          {
            game.factoryunlocked = 1
          }
        game.miner1cost = 22+Math.log10(5.5)*game.miner1bought
        if(game.miner1bought>9)
          {
            game.miner1cost *= 1+(game.miner1bought-10)/20
          }
        game.miner2cost = 26+Math.log10(8)*game.miner2bought
        if(game.miner2bought>9)
          {
            game.miner2cost *= 1+(game.miner2bought-10)/20
          }
        game.miner3cost = 30+Math.log10(14)*game.miner3bought
        if(game.miner3bought>9)
          {
            game.miner3cost *= 1+(game.miner3bought-10)/20
          }
        game.miner4cost = 34+Math.log10(20)*game.miner4bought
        if(game.miner4bought>9)
          {
            game.miner4cost *= 1+(game.miner4bought-10)/20
          }
        game.miner1mult = Math.log10(2)*game.miner1bought
        game.miner2mult = Math.log10(2)*game.miner2bought
        game.miner3mult = Math.log10(2)*game.miner3bought
        game.miner4mult = Math.log10(2)*game.miner4bought
        game.miner1amount = infAdd(game.miner1amount,game.miner2amount-4+game.miner2mult)
        game.miner2amount = infAdd(game.miner2amount,game.miner3amount-4+game.miner3mult)
        game.miner3amount = infAdd(game.miner3amount,game.miner4amount-4+game.miner4mult)
        game.factoryxpgain = game.miner1amount+game.miner1mult
        game.factoryxp = infAdd(game.factoryxp,game.factoryxpgain-2)
        if(game.factoryxp>game.factoryreq)
          {
            game.factoryxp = infSubtract(game.factoryxp,game.factoryreq)
            game.factorylvl ++
          }
        game.U10_price = 45+Math.log10(90)*game.U10_lvl
        game.U10_eff = game.U10_lvl*10



        document.getElementById('mine-hp').textContent = 'HP: '+infFormat(game.objhp)+'/'+infFormat(game.objmaxhp)
        document.getElementById('mine-def').textContent = 'DEF: '+infFormat(game.objdef)
        document.getElementById('mine-reward').textContent = '+'+infFormat(game.objreward)+'$'
        document.getElementById('mine-name').textContent = orenames[game.currentlevel]
        document.getElementById('mine-number').textContent = '#'+game.currentlevel
        if(game.showorenum == true)
          {
            document.getElementById('mine-number').style.display = 'inline'
          }
          else
          {
            document.getElementById('mine-number').style.display = 'none'
          }
        document.getElementById('mine-stage').textContent = 'Stage '+game.currentstage+'/10'
        document.getElementById('money').textContent = infFormat(game.money)+'$'
        document.getElementById('pickaxe-stats-dmg').textContent = 'Base damage: '+infFormat(game.damage)
        document.getElementById('pickaxe-stats-upg8').textContent = "'Mega clicker': x"+infFormat(game.U8_eff,2)
        document.getElementById('pickaxe-stats-def').textContent = 'Defence: -'+infFormat(game.objdef)
        document.getElementById('pickaxe-stats-final').textContent = 'Final damage: '+infFormat(game.finaldamage)
        document.getElementById('pickaxe-stats-auto').textContent = 'Auto damage: '+infFormat(game.autoclickerdmg)
        document.getElementById('gems').textContent = infFormat(game.gems)
        document.getElementById('hpbar2').style.width = 100/Math.pow(10,game.objmaxhp-game.objhp)+'%'
        document.getElementById('xpbar2').style.width = 100/Math.pow(10,game.factoryreq-game.factoryxp)+'%'
        document.getElementById('pickaxe-stats-quality').textContent = 'Quality: '+infFormat(game.picquality)+'%'
        if(game.picpoints>0)
          {
          document.getElementById('pickaxe-stats-enchance').textContent = 'Enchancements: '+game.picpoints+' (x'+infFormat(game.pointeff,2)+')'
          }
          else
          {
            document.getElementById('pickaxe-stats-enchance').textContent = '???'
          }
        document.getElementById('createpicmindmg').textContent = 'Average damage:'+infFormat(game.smithing_power)
        document.getElementById('U3lvl').textContent = game.U3_lvl+'/20'
        document.getElementById('U4lvl').textContent = game.U4_lvl+'/30'
        document.getElementById('U6lvl').textContent = game.U6_lvl+'/20'
        document.getElementById('U9lvl').textContent = game.U9_lvl+'/9'
        if(game.picpoints>0)
          {
            document.getElementById('createpicench').textContent = 'Enchantments: '+game.U3_eff
          }
          else
          {
            document.getElementById('createpicench').textContent = '???'
          }
        document.getElementById('createpicprice').textContent = infFormat(game.piccreateprice)
        document.getElementById('notation').textContent = 'Notation: '+notation
        if(game.upgrade_selected == 0)
          {
            document.getElementById('upgrade-info-text').textContent = 'Select an upgrade to view its description!'
          }
          else if(game.upgrade_selected == 1)
          {
            if(game.factoryeff2>0)
              {
                document.getElementById('upgrade-info-text').textContent = '('+game.U1_lvl+'+'+game.factoryeff2+') '+'Better smithing: Improve the minimum power of pickaxes to '+infFormat(game.U1_eff)
              }
              else
              {
                document.getElementById('upgrade-info-text').textContent = '('+game.U1_lvl+') '+'Better smithing: Improve the minimum power of pickaxes to '+infFormat(game.U1_eff)
              }
            document.getElementById('upgrade-price-text').textContent = 'Cost: '+infFormat(game.U1_price)+'$'
          }
          else if(game.upgrade_selected == 2)
            {
              document.getElementById('upgrade-info-text').textContent = '('+game.U2_lvl+') '+'Quality pickaxes: Improve the minimum quality of pickaxes to '+infFormat(game.quality)+'%'
              document.getElementById('upgrade-price-text').textContent = 'Cost: '+infFormat(game.U2_price)+'$'
            }
            else if(game.upgrade_selected == 3)
              {
                document.getElementById('upgrade-info-text').textContent = 'Increasing expertice: Increase the maximum pickaxe enchantments to '+game.U3_lvl+' ('+game.U3_lvl+'/20)'
                document.getElementById('upgrade-price-text').textContent = 'Cost: '+infFormat(game.U3_price)+'$'
              }
              else if(game.upgrade_selected == 4)
                {
                  document.getElementById('upgrade-info-text').textContent = 'Gem finder: Increase the chance to find diamonds by '+game.U4_eff+'% ('+game.U4_lvl+'/30)'
                  document.getElementById('upgrade-price-text').textContent = 'Cost: '+infFormat(game.U4_price)+'$'
                }
                else if(game.upgrade_selected == 5)
                  {
                    document.getElementById('upgrade-info-text').textContent = '('+game.U5_lvl+') '+'Autominer reforging: Improve the autoclicker power relative to pickaxe power to x'+infFormat(game.U5_eff,2)
                    document.getElementById('upgrade-price-text').textContent = 'Cost: '+infFormat(game.U5_price)+'$'
                  }
                  else if(game.upgrade_selected == 6)
                    {
                      document.getElementById('upgrade-info-text').textContent = 'Autominer acceleration: Increase the autoclicker speed to '+Math.floor(game.autoclickerspeed*100)/100+'/s'
                      document.getElementById('upgrade-price-text').textContent = 'Cost: '+infFormat(game.U6_price)+'$'
                    }
                    else if(game.upgrade_selected == 7)
                      {
                        document.getElementById('upgrade-info-text').textContent = '('+game.U7_lvl+') '+'Doubler: Just double money gain. Simple! (x'+infFormat(game.U7_eff)+')'
                        document.getElementById('upgrade-price-text').textContent = 'Cost: '+infFormat(game.U7_price)+'$'
                      }
                      else if(game.upgrade_selected == 8)
                        {
                          document.getElementById('upgrade-info-text').textContent = '('+game.U8_lvl+') '+'Mega clicker: Multiply click power by x'+infFormat(game.U8_eff,2)
                          document.getElementById('upgrade-price-text').textContent = 'Cost: '+infFormat(game.U8_price)+'$'
                        }
                        else if(game.upgrade_selected == 9)
                          {
                            document.getElementById('upgrade-info-text').textContent = 'Gem waster: Waste more gems for better pickaxes! ('+infFormat(Math.log10(Math.floor(Math.pow(10,Math.log10(3.28732)*game.U9_lvl))),2)+' -> '+infFormat(Math.log10(Math.floor(Math.pow(10,Math.log10(3.28732)*(game.U9_lvl+1)))),2)+')'
                            document.getElementById('upgrade-price-text').textContent = 'Cost: '+infFormat(game.U9_price)+'$'
                          }
                          else if(game.upgrade_selected == 10)
                            {
                              document.getElementById('upgrade-info-text').textContent = "Smithing blocker: Offset the first upgrade's cost by 10 levels. (-"+game.U10_eff+" levels)"
                              document.getElementById('upgrade-price-text').textContent = 'Cost: '+infFormat(game.U10_price)+'$'
                            }
        document.getElementById('factorylvl').textContent = 'Factory level: '+game.factorylvl
        document.getElementById('factoryxp').textContent = 'XP: '+infFormat(game.factoryxp,1)+'/'+infFormat(game.factoryreq)+'   ('+infFormat(game.factoryxpgain,2)+' XP/s)'
        document.getElementById('factoryeff1').textContent = 'Factory boost I: x'+infFormat(game.factoryeff1,2)+'$'
        document.getElementById('factoryeff2').textContent = 'Factory boost II: +'+game.factoryeff2+' better smithing lvls'
        document.getElementById('factoryeff3').textContent = 'Factory boost III: +'+infFormat(game.factoryeff3)+' gem gain'
        document.getElementById('miner1info1').textContent = 'Noob miner ('+infFormat(game.miner1amount,2)+', x'+infFormat(game.miner1mult)+')'
        document.getElementById('miner1info2').textContent = 'Buy one for '+infFormat(game.miner1cost)+'$ ('+game.miner1bought+')'
        document.getElementById('miner2info1').textContent = 'Intern miner ('+infFormat(game.miner2amount,2)+', x'+infFormat(game.miner2mult)+')'
        document.getElementById('miner2info2').textContent = 'Buy one for '+infFormat(game.miner2cost)+'$ ('+game.miner2bought+')'
        document.getElementById('miner3info1').textContent = 'Advanced miner ('+infFormat(game.miner3amount,2)+', x'+infFormat(game.miner3mult)+')'
        document.getElementById('miner3info2').textContent = 'Buy one for '+infFormat(game.miner3cost)+'$ ('+game.miner3bought+')'
        document.getElementById('miner4info1').textContent = 'Senior miner ('+infFormat(game.miner4amount,2)+', x'+infFormat(game.miner4mult)+')'
        document.getElementById('miner4info2').textContent = 'Buy one for '+infFormat(game.miner4cost)+'$ ('+game.miner4bought+')'


        if(game.factoryunlocked == 1)
          {
            document.getElementById('factorytab').style.display = 'flex'
          }
          else
          {
            document.getElementById('factorytab').style.display = 'none'
          }

        if(game.currentlevel>0)
          {
            document.getElementById('changeobj1').style.opacity = 1
          }
          else
          {
            document.getElementById('changeobj1').style.opacity = 0.5
          }

          if(game.currentlevel<game.bestlevel && game.currentlevel<56)
            {
              document.getElementById('changeobj2').style.opacity = 1
            }
            else
            {
              document.getElementById('changeobj2').style.opacity = 0.5
            }

            if(game.currentstage>0)
              {
                document.getElementById('changeobj3').style.opacity = 1
              }
              else
              {
                document.getElementById('changeobj3').style.opacity = 0.5
              }
    
              if(game.currentstage<game.beststage || game.currentlevel<game.bestlevel)
                {
                  document.getElementById('changeobj4').style.opacity = 1
                }
                else
                {
                  document.getElementById('changeobj4').style.opacity = 0.5
                }

        if(game.gemwastercurrentlvl>0)
          {
            document.getElementById('changewaster1').style.opacity = 1
          }
          else
          {
            document.getElementById('changewaster1').style.opacity = 0
          }

          if(game.U9_lvl>game.gemwastercurrentlvl)
            {
              document.getElementById('changewaster2').style.opacity = 1
            }
            else
            {
              document.getElementById('changewaster2').style.opacity = 0
            }



        if(game.menu == 1)
          {
            document.getElementById('whole-object').style.display = 'inline'
            document.getElementById('pickaxe-stats').style.display = 'inline'
            document.getElementById('upgrade-subtabs').style.display = 'flex'
            document.getElementById('money-upgrades').style.display = 'inline'
            document.getElementById('upgrade-info').style.display = 'inline'
            document.getElementById('changewasterdiv').style.display = 'inline'
            document.getElementById('event-log').style.display = 'inline'
          }
          else
          {
            document.getElementById('whole-object').style.display = 'none'
            document.getElementById('pickaxe-stats').style.display = 'none'
            document.getElementById('upgrade-subtabs').style.display = 'none'
            document.getElementById('money-upgrades').style.display = 'none'
            document.getElementById('upgrade-info').style.display = 'none'
            document.getElementById('changewasterdiv').style.display = 'none'
            document.getElementById('event-log').style.display = 'none'
          }
          if(game.menu == 2)
            {
              document.getElementById('factorydiv').style.display = 'inline'
            }
            else
            {
              document.getElementById('factorydiv').style.display = 'none'
            }
          if(game.menu == 5)
            {
              document.getElementById('options').style.display = 'inline'
            }
            else
            {
              document.getElementById('options').style.display = 'none'
            }
            if(game.menu == 4)
              {
                document.getElementById('achievements-div').style.display = 'inline'
              }
              else
              {
                document.getElementById('achievements-div').style.display = 'none'
              }
              if(game.menu == 6)
                {
                  document.getElementById('help-div').style.display = 'inline'
                }
                else
                {
                  document.getElementById('help-div').style.display = 'none'
                }

        if(game.money > -2000)
          {
            document.getElementById('help-box1').style.display = 'inline'
          }
          else
          {
            document.getElementById('help-box1').style.display = 'none'
          }
          if(game.damage>Math.log10(3))
            {
              document.getElementById('help-box2').style.display = 'inline'
            }
            else
            {
              document.getElementById('help-box2').style.display = 'none'
            }
            if(game.picpoints>0)
              {
                document.getElementById('help-box3').style.display = 'inline'
              }
              else
              {
                document.getElementById('help-box3').style.display = 'none'
              }
              if(game.factoryunlocked == 1)
                {
                  document.getElementById('help-box4').style.display = 'inline'
                }
                else
                {
                  document.getElementById('help-box4').style.display = 'none'
                }
                if(game.bestlevel>55)
                  {
                    document.getElementById('help-box5').style.display = 'inline'
                  }
                  else
                  {
                    document.getElementById('help-box5').style.display = 'none'
                  }




        if(game.money>2 &&! game.achievements.includes('ach1'))
          {
            game.achievements.push('ach1')
          }
          if(game.damage>Math.log10(49) &&! game.achievements.includes('ach2'))
            {
              game.achievements.push('ach2')
            }
            if(game.bestlevel>10 &&! game.achievements.includes('ach3'))
              {
                game.achievements.push('ach3')
              }
              if(game.money>15 &&! game.achievements.includes('ach4'))
                {
                  game.achievements.push('ach4')
                }
                if(game.picpoints>5 &&! game.achievements.includes('ach5'))
                  {
                    game.achievements.push('ach5')
                  }
                  if(game.money>Math.log10(3.0e26) &&! game.achievements.includes('ach6'))
                    {
                      game.achievements.push('ach6')
                    }
                    if(game.factoryunlocked == 1 &&! game.achievements.includes('ach8'))
                      {
                        game.achievements.push('ach8')
                      }
                      if(game.miner2bought>0 &&! game.achievements.includes('ach9'))
                        {
                          game.achievements.push('ach9')
                        }
                      if(game.bestlevel>42 &&! game.achievements.includes('ach10'))
                        {
                          game.achievements.push('ach10')
                        }
                        if(game.finaldamage>48 &&! game.achievements.includes('ach11'))
                          {
                            game.achievements.push('ach11')
                          }
                          if(game.bestlevel>55 &&! game.achievements.includes('ach12'))
                            {
                              game.achievements.push('ach12')
                            }


          if(game.achievements.includes('ach1'))
            {
              document.getElementById('ach1').style.backgroundColor = 'lightgreen'
            }
            else
            {
              document.getElementById('ach1').style.backgroundColor = 'white'
            }
            if(game.achievements.includes('ach2'))
              {
                document.getElementById('ach2').style.backgroundColor = 'lightgreen'
              }
              else
              {
                document.getElementById('ach2').style.backgroundColor = 'white'
              }
              if(game.achievements.includes('ach3'))
                {
                  document.getElementById('ach3').style.backgroundColor = 'lightgreen'
                }
                else
                {
                  document.getElementById('ach3').style.backgroundColor = 'white'
                }
                if(game.achievements.includes('ach4'))
                  {
                    document.getElementById('ach4').style.backgroundColor = 'lightgreen'
                  }
                  else
                  {
                    document.getElementById('ach4').style.backgroundColor = 'white'
                  }
                  if(game.achievements.includes('ach5'))
                    {
                      document.getElementById('ach5').style.backgroundColor = 'lightgreen'
                    }
                    else
                    {
                      document.getElementById('ach5').style.backgroundColor = 'white'
                    }
                    if(game.achievements.includes('ach6'))
                      {
                        document.getElementById('ach6').style.backgroundColor = 'lightgreen'
                      }
                      else
                      {
                        document.getElementById('ach6').style.backgroundColor = 'white'
                      }
                      if(game.achievements.includes('ach7'))
                        {
                          document.getElementById('ach7').style.backgroundColor = 'lightgreen'
                        }
                        else
                        {
                          document.getElementById('ach7').style.backgroundColor = 'white'
                        }
                        if(game.achievements.includes('ach8'))
                          {
                            document.getElementById('ach8').style.backgroundColor = 'lightgreen'
                          }
                          else
                          {
                            document.getElementById('ach8').style.backgroundColor = 'white'
                          }
                          if(game.achievements.includes('ach9'))
                            {
                              document.getElementById('ach9').style.backgroundColor = 'lightgreen'
                            }
                            else
                            {
                              document.getElementById('ach9').style.backgroundColor = 'white'
                            }
                            if(game.achievements.includes('ach10'))
                              {
                                document.getElementById('ach10').style.backgroundColor = 'lightgreen'
                              }
                              else
                              {
                                document.getElementById('ach10').style.backgroundColor = 'white'
                              }
                              if(game.achievements.includes('ach11'))
                                {
                                  document.getElementById('ach11').style.backgroundColor = 'lightgreen'
                                }
                                else
                                {
                                  document.getElementById('ach11').style.backgroundColor = 'white'
                                }
                                if(game.achievements.includes('ach12'))
                                  {
                                    document.getElementById('ach12').style.backgroundColor = 'lightgreen'
                                  }
                                  else
                                  {
                                    document.getElementById('ach12').style.backgroundColor = 'white'
                                  }
}















function previouslevel()
{
    if(game.currentlevel>0)
    {
        game.currentlevel --
    }
    let objectElement = document.getElementById('object');
    objectElement.style.backgroundImage = `url('ores/object${game.currentlevel}.svg')`;
    game.objmaxhp = Math.log10(40)+Math.log10(8.5)*game.currentlevel+Math.log10(1.2)*game.currentstage
    if(game.objmaxhp<60)
    {
    game.objmaxhp = Math.log10(Math.floor(Math.pow(10,game.objmaxhp)/Math.pow(10,Math.floor(game.objmaxhp)-2))*Math.pow(10,Math.floor(game.objmaxhp)-2))
    }
    if(game.currentlevel>85)
      {
        game.objmaxhp *= 1+((game.currentlevel-85)/100)
      }

    game.objhp = game.objmaxhp
}

function nextlevel()
{
    if(game.currentlevel<game.bestlevel && game.currentlevel<56)
        {
            game.currentlevel ++
            game.currentstage = 0
        }
    let objectElement = document.getElementById('object');
    objectElement.style.backgroundImage = `url('ores/object${game.currentlevel}.svg')`;
    game.objmaxhp = Math.log10(40)+Math.log10(8.5)*game.currentlevel+Math.log10(1.2)*game.currentstage
    if(game.objmaxhp<60)
        {
    game.objmaxhp = Math.log10(Math.floor(Math.pow(10,game.objmaxhp)/Math.pow(10,Math.floor(game.objmaxhp)-2))*Math.pow(10,Math.floor(game.objmaxhp)-2))
        }
        if(game.currentlevel>85)
          {
            game.objmaxhp *= 1+((game.currentlevel-85)/100)
          }
    game.objhp = game.objmaxhp
}

function previousstage()
{
    if(game.currentstage>0)
    {
    game.currentstage --
    }
    game.objmaxhp = Math.log10(40)+Math.log10(8.5)*game.currentlevel+Math.log10(1.2)*game.currentstage
    if(game.objmaxhp<60)
    {
    game.objmaxhp = Math.log10(Math.floor(Math.pow(10,game.objmaxhp)/Math.pow(10,Math.floor(game.objmaxhp)-2))*Math.pow(10,Math.floor(game.objmaxhp)-2))
    }
    if(game.currentlevel>85)
      {
        game.objmaxhp *= 1+((game.currentlevel-85)/100)
      }
    game.objhp = game.objmaxhp
}

function nextstage()
{
    if(game.bestlevel>game.currentlevel && game.currentstage<10)
        {
            game.currentstage ++
        }
        else
        {
            if(game.currentstage<10 && game.currentstage<game.beststage)
                {
                game.currentstage ++
                }
        }

    game.objmaxhp = Math.log10(40)+Math.log10(8.5)*game.currentlevel+Math.log10(1.2)*game.currentstage
    if(game.objmaxhp<60)
        {
    game.objmaxhp = Math.log10(Math.floor(Math.pow(10,game.objmaxhp)/Math.pow(10,Math.floor(game.objmaxhp)-2))*Math.pow(10,Math.floor(game.objmaxhp)-2))
        }
        if(game.currentlevel>85)
          {
            game.objmaxhp *= 1+((game.currentlevel-85)/100)
          }

    game.objhp = game.objmaxhp
}

setInterval(tick,10)

function mine_click()
{
    var obj = document.getElementById('object');
    obj.classList.remove('animated');
    void obj.offsetWidth;
    obj.classList.add('animated');

    if(game.finaldamage !== -996)
      {
    game.objhp = infSubtract(game.objhp,game.finaldamage)
      }

    if(game.objhp == 0)
        {
            game.objhp = game.objmaxhp
            game.money = infAdd(game.money,game.objreward)
            objbreak()
        }
}

function auto_mine_click()
{
    var obj = document.getElementById('object');
    obj.classList.remove('animated');
    void obj.offsetWidth;
    obj.classList.add('animated');

    if(game.autoclickerdmg !== -996)
      {
    game.objhp = infSubtract(game.objhp,game.autoclickerdmg)
      }

    if(game.objhp == 0)
        {
            game.objhp = game.objmaxhp
            game.money = infAdd(game.money,game.objreward)
            objbreak()
        }
}

function objbreak()
{
  if(game.currentstage<10)
    {
        if(game.autostageprogress == true && game.beststage == game.currentstage && game.currentlevel == game.bestlevel)
            {
                game.currentstage ++
                game.beststage ++
            }
            else
            {
              if(game.beststage == game.currentstage)
                {
              game.beststage ++
                }
            }
    }

    if(game.currentlevel == game.bestlevel && game.beststage>9)
    {
        game.beststage = 0
        game.bestlevel ++

        if(game.autolevelprogress == true)
        {
            nextlevel()
        }
    }

    game.objmaxhp = Math.log10(40)+Math.log10(8.5)*game.currentlevel+Math.log10(1.2)*game.currentstage
    if(game.objmaxhp<60)
        {
    game.objmaxhp = Math.log10(Math.floor(Math.pow(10,game.objmaxhp)/Math.pow(10,Math.floor(game.objmaxhp)-2))*Math.pow(10,Math.floor(game.objmaxhp)-2))
        }
        if(game.currentlevel>85)
          {
            game.objmaxhp *= 1+((game.currentlevel-85)/100)
          }

    game.objhp = game.objmaxhp

    if(Math.random()*100<game.gem_chance)
      {
        game.gems = infAdd(game.gems,game.factoryeff3)
      }
}

function loaded()
{
    let objectElement = document.getElementById('object');
    objectElement.style.backgroundImage = `url('ores/object${game.currentlevel}.svg')`;
    game.objmaxhp = Math.log10(40)+Math.log10(8.5)*game.currentlevel+Math.log10(1.2)*game.currentstage
    if(game.objmaxhp<60)
        {
    game.objmaxhp = Math.log10(Math.floor(Math.pow(10,game.objmaxhp)/Math.pow(10,Math.floor(game.objmaxhp)-2))*Math.pow(10,Math.floor(game.objmaxhp)-2))
        }

    game.objhp = game.objmaxhp
}

function createpic()
{
  if(game.gems>infAdd(game.piccreateprice,-999))
    {
      game.expectedquality = game.quality+Math.log10((Math.random()+0.6))
      game.expecteddmg = game.smithing_power+Math.log10((Math.random()+0.6))+(game.expectedquality-2)+Math.log10(1.2)*game.U3_eff
      if(game.damage<game.expecteddmg)
        {
          game.logtext = "Success! The new pickaxe's damage is "+infFormat(game.expecteddmg)+'!'
          logEvent(game.logtext,'green')

          game.damage = game.expecteddmg
          game.picquality = game.expectedquality
          game.picpoints = Math.floor(game.U3_eff)
          if(game.U3_lvl<8)
            {
              game.dudsInARow = 0
            }
            else
            {
              game.dudsInARow = game.U3_lvl-7
            }
        }
        else
        {
          game.logtext = "Sorry, I crafted a dud... (DMG:"+infFormat(game.expecteddmg)+',Q:'+infFormat(game.expectedquality)+'%)'
          logEvent(game.logtext,'red')

          game.dudsInARow ++
        }

        game.gems = infSubtract(game.gems, game.piccreateprice)
        if(game.piccreateprice>Math.log10(4000) &&! game.achievements.includes('ach7'))
          {
            game.achievements.push('ach7')
          }
    }
}

function previouswasterlvl()
{
  if(game.gemwastercurrentlvl>0)
    {
      game.gemwastercurrentlvl --
    }
}

function nextwasterlvl()
{
  if(game.U9_lvl>game.gemwastercurrentlvl)
    {
      game.gemwastercurrentlvl ++
    }
}

function selectupg(a)
{
  game.upgrade_selected = a
}

function U1()
{
  if(game.money>game.U1_price)
    {
      game.money = infSubtract(game.money,game.U1_price)
      game.U1_lvl ++
    }
}

function U2()
{
  if(game.money>game.U2_price)
    {
      game.money = infSubtract(game.money,game.U2_price)
      game.U2_lvl ++
    }
}

function U3()
{
  if(game.money>game.U3_price&& game.U3_lvl<20)
    {
      game.money = infSubtract(game.money,game.U3_price)
      game.U3_lvl ++
    }
}

function U4()
{
  if(game.money>game.U4_price && game.U4_lvl<30)
    {
      game.money = infSubtract(game.money,game.U4_price)
      game.U4_lvl ++
    }
}

function U5()
{
  if(game.money>game.U5_price)
    {
      game.money = infSubtract(game.money,game.U5_price)
      game.U5_lvl ++
    }
}

function U6()
{
  if(game.money>game.U6_price && game.U6_lvl<20)
    {
      game.money = infSubtract(game.money,game.U6_price)
      game.U6_lvl ++
    }
}

function U7()
{
  if(game.money>game.U7_price)
    {
      game.money = infSubtract(game.money,game.U7_price)
      game.U7_lvl ++
    }
}

function U8()
{
  if(game.money>game.U8_price)
    {
      game.money = infSubtract(game.money,game.U8_price)
      game.U8_lvl ++
    }
}

function U9()
{
  if(game.money>game.U9_price && game.U9_lvl<9)
    {
      game.money = infSubtract(game.money,game.U9_price)
      game.U9_lvl ++
    }
}

function U10()
{
  if(game.money>game.U10_price && game.U10_lvl<9)
    {
      game.money = infSubtract(game.money,game.U10_price)
      game.U10_lvl ++
    }
}

function miner1()
{
  if(game.money>game.miner1cost)
    {
      game.money = infSubtract(game.money,game.miner1cost)
      game.miner1bought ++
      game.miner1amount = infAdd(game.miner1amount,0)
    }
}

function miner2()
{
  if(game.money>game.miner2cost)
    {
      game.money = infSubtract(game.money,game.miner2cost)
      game.miner2bought ++
      game.miner2amount = infAdd(game.miner2amount,0)
    }
}

function miner3()
{
  if(game.money>game.miner3cost)
    {
      game.money = infSubtract(game.money,game.miner3cost)
      game.miner3bought ++
      game.miner3amount = infAdd(game.miner3amount,0)
    }
}

function miner4()
{
  if(game.money>game.miner4cost)
    {
      game.money = infSubtract(game.money,game.miner4cost)
      game.miner4bought ++
      game.miner4amount = infAdd(game.miner4amount,0)
    }
}



function changemenu(a)
{
  game.menu = a
}

function changeTheme()
{
  game.theme ++
  if(game.theme == 2)
    {
      game.theme = 0
    }
    
}


function changenotation(a)
{
  if(a == 1)
    {
  notation = 'Mixed scientific'
    }
    else if(a == 2)
      {
        notation = 'Engineering'
      }
      else if(a == 3)
        {
          notation = 'Logarithm'
        }
        else if(a == 4)
          {
            notation = 'Double Logarithm'
          }
          else if(a == 5)
            {
              notation = 'Scientific'
            }
            else if(a == 6)
              {
                notation = 'Alemaninc Ordinal'
              }
              else if(a == 7)
                {
                  notation = 'Tetration'
                }
                else if(a == 8)
                  {
                    notation = 'Strange'
                  }
}


function ach(a)
{
  game.achchosen = a
  if(a == 1)
    {
  document.getElementById('achname').textContent = 'Starting out'
  document.getElementById('achdesc').textContent = 'Get 100 dollars.'
    }
    else if(a == 2)
      {
        document.getElementById('achname').textContent = 'As strong as paper'
        document.getElementById('achdesc').textContent = 'Reach 50 pickaxe damage.'
      }
      else if(a == 3)
        {
          document.getElementById('achname').textContent = 'Deeper and deeper'
          document.getElementById('achdesc').textContent = "Reach 'Carbonite' (#11)."
        }
        else if(a == 4)
          {
            document.getElementById('achname').textContent = 'Quadrillionare'
            document.getElementById('achdesc').textContent = "Get 1Qa dollars."
          }
          else if(a == 5)
            {
              document.getElementById('achname').textContent = 'So unlucky, yet so lucky'
              document.getElementById('achdesc').textContent = "Get 6 enchantments on your pickaxe."
            }
            else if(a == 6)
              {
                document.getElementById('achname').textContent = "America's debt^2"
                document.getElementById('achdesc').textContent = "Get 300Sp dollars."
              }
              else if(a == 7)
                {
                  document.getElementById('achname').textContent = "Professional gem waster"
                  document.getElementById('achdesc').textContent = "Waste over 4000 diamonds at once on a pickaxe."
                }
                else if(a == 8)
                  {
                    document.getElementById('achname').textContent = "Industrial revolution in a cave???"
                    document.getElementById('achdesc').textContent = "Have 10Sx $ at hand and unlock 'The factory'."
                  }
                  else if(a == 9)
                    {
                      document.getElementById('achname').textContent = "Exponential improvement"
                      document.getElementById('achdesc').textContent = "Buy a starter worker."
                    }
                else if(a == 10)
                  {
                    document.getElementById('achname').textContent = "So unreal it became an ore"
                    document.getElementById('achdesc').textContent = "Reach 'Unrealite' (#43)."
                  }
                  else if(a == 11)
                    {
                      document.getElementById('achname').textContent = "God-like power"
                      document.getElementById('achdesc').textContent = "Get your pickaxe damage to 1QiDc. Wow!"
                    }
                    else if(a == 12)
                      {
                        document.getElementById('achname').textContent = "Endgame"
                        document.getElementById('achdesc').textContent = "Reach THE GEM. This is the end for now, updates coming soon!"
                      }
}



function exportGame() {
  const dataStr = JSON.stringify(game);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const downloadLink = document.createElement('a');
  downloadLink.download = 'IdleMineRein_SaveData.json';
  downloadLink.href = window.URL.createObjectURL(dataBlob);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}



function importGame() {
  const fileInput = document.getElementById('fileInput');
  if (fileInput.files.length === 0) {
      alert('No file selected!');
      return;
  }
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function(event) {
      const importedData = JSON.parse(event.target.result);
      game = importedData
  };

  reader.readAsText(file);
}

function hardReset() {
  alert("Are you sure you want to hard reset the game? This action is non-reversible!");
  var userInput = prompt("Please type 'I am sure' to confirm:");
  if (userInput === "I am sure") {
    fullreset()
      alert("Alright, you asked for it...");
  } else {
      alert("That was close. (You were not sure)");
  }
}

function fullreset()
{
  savegame = null
  game = {
    money: -999,
    gems: -999,
    currentlevel: 0,
    currentstage: 0,
    bestlevel: 0,
    beststage: 0,
    upgrade_selected: 0,
    smithing_power: 0,
    gem_chance: 5,
    dudsInARow: 0,
    quality: 0,
    picquality: 0,
    picpoints: 0,
    pointeff: 0,
    expecteddmg: 0,
    expectedquality: 0,
    logtext: '',
    autoclickerspeed: 0,
    autoclickercooldown: 100,
    autoclickerdmg: 0,
    gemwastercurrentlvl: 0,
    piccreateprice: 0,

    objmaxhp: 0,
    objhp: 0,
    objdef: 0,
    objreward: 0,
    damage: Math.log10(3),
    finaldamage: 0,

    U1_price: 0,
    U1_eff: 0,
    U1_lvl: 0,
    U2_price: 0,
    U2_eff: 0,
    U2_lvl: 0,
    U3_price: 0,
    U3_eff: 0,
    U3_lvl: 0,
    U4_price: 0,
    U4_eff: 0,
    U4_lvl: 0,
    U5_price: 0,
    U5_eff: 0,
    U5_lvl: 0,
    U6_price: 0,
    U6_eff: 0,
    U6_lvl: 0,
    U7_price: 0,
    U7_eff: 0,
    U7_lvl: 0,
    U8_price: 0,
    U8_eff: 0,
    U8_lvl: 0,
    U9_price: 0,
    U9_eff: 0,
    U9_lvl: 0,
    U10_price: 0,
    U10_eff: 0,
    U10_lvl: 0,

    factorylvl: 0,
    factoryxp: 0,
    factoryxpgain: 0,
    factoryreq: 0,
    factoryeff1: 0,
    factoryeff2: 0,
    factoryeff3: 0,

    miner1cost: 0,
    miner1amount: -999,
    miner1mult: 0,
    miner1bought: 0,
    miner2cost: 0,
    miner2amount: -999,
    miner2mult: 0,
    miner2bought: 0,
    miner3cost: 0,
    miner3amount: -999,
    miner3mult: 0,
    miner3bought: 0,
    miner4cost: 0,
    miner4amount: -999,
    miner4mult: 0,
    miner4bought: 0,

    offline_time: Date.now(),
    offline_money: 0,
    offline_xp: 0,
    offline_miner1: 0,
    offline_miner2: 0,
    offline_miner3: 0,
    offlinefactorylvls: 0,


    autostageprogress: false,
    autolevelprogress: false,
    showorenum: false,
    menu: 1,
    factoryunlocked: 0,

    achievements: [],
    achchosen: 1,
}
offline_time = 0
}









function logEvent(message,textcolor) {
  const eventLog = document.getElementById('event-log');
  const logEntry = document.createElement('div');
  logEntry.className = 'event-entry';
  logEntry.textContent = message;
  logEntry.style.color = textcolor
  eventLog.appendChild(logEntry);
  eventLog.scrollTop = eventLog.scrollHeight;
}


const autocheck1 = document.getElementById('auto1');
const autocheck2 = document.getElementById('auto2');
const autocheck3 = document.getElementById('auto3');


autocheck1.addEventListener('change', function() {
    game.autostageprogress = autocheck1.checked;
})
autocheck2.addEventListener('change', function() {
  game.autolevelprogress = autocheck2.checked;
})
autocheck3.addEventListener('change', function() {
  game.showorenum = autocheck3.checked;
})





document.addEventListener('DOMContentLoaded', () => {
  const smokeContainer = document.querySelector('.smoke-container');

  function createSmoke() {
      const smoke = document.createElement('img');
      if(Math.random()>0.5)
        {
          smoke.src = 'otherpics/smoke1.svg';
        }
        else
        {
          smoke.src = 'otherpics/smoke2.svg';
        }
      smoke.classList.add('smoke');
      smokeContainer.appendChild(smoke);

      smoke.addEventListener('animationend', () => {
          smokeContainer.removeChild(smoke);
      });

      setTimeout(createSmoke, 2000);
  }

  createSmoke();
});
//first version done lets gooooooo