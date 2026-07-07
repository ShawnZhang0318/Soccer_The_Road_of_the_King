(function () {
  "use strict";

  const SAVE_KEY = "road-to-king-career-save-v1";

  const ELITE_ACADEMY_NAMES = [
    "拜仁慕尼黑",
    "多特蒙德",
    "巴黎圣日尔曼",
    "皇家马德里",
    "巴塞罗那",
    "马德里竞技",
    "尤文图斯",
    "AC米兰",
    "国际米兰",
    "那不勒斯",
    "阿森纳",
    "曼城",
    "切尔西",
    "利物浦",
    "热刺",
    "曼联"
  ];

  const NATIONALITIES = [
    "中国",
    "日本",
    "韩国",
    "英格兰",
    "法国",
    "德国",
    "西班牙",
    "意大利",
    "葡萄牙",
    "荷兰",
    "巴西",
    "阿根廷",
    "乌拉圭",
    "克罗地亚",
    "比利时",
    "美国"
  ];

  const POSITIONS = [
    { id: "GK", name: "门将", line: "goalkeeper" },
    { id: "CB", name: "中后卫", line: "defender" },
    { id: "LB", name: "左后卫", line: "defender" },
    { id: "RB", name: "右后卫", line: "defender" },
    { id: "DM", name: "后腰", line: "midfielder" },
    { id: "CM", name: "中场", line: "midfielder" },
    { id: "AM", name: "前腰", line: "attacker" },
    { id: "LW", name: "左边锋", line: "attacker" },
    { id: "RW", name: "右边锋", line: "attacker" },
    { id: "ST", name: "中锋", line: "attacker" }
  ];

  const OVERALL_WEIGHTS = {
    GK: { goalkeeping: 0.64, physical: 0.12, passing: 0.1, pace: 0.08, defending: 0.06 },
    CB: { defending: 0.38, physical: 0.22, pace: 0.14, passing: 0.12, dribbling: 0.08, shooting: 0.06 },
    LB: { pace: 0.24, defending: 0.26, physical: 0.16, passing: 0.16, dribbling: 0.12, shooting: 0.06 },
    RB: { pace: 0.24, defending: 0.26, physical: 0.16, passing: 0.16, dribbling: 0.12, shooting: 0.06 },
    DM: { defending: 0.24, passing: 0.25, physical: 0.2, dribbling: 0.12, pace: 0.1, shooting: 0.09 },
    CM: { passing: 0.3, dribbling: 0.2, physical: 0.15, defending: 0.13, pace: 0.12, shooting: 0.1 },
    AM: { passing: 0.3, dribbling: 0.26, shooting: 0.2, pace: 0.12, physical: 0.08, defending: 0.04 },
    LW: { pace: 0.26, dribbling: 0.28, shooting: 0.22, passing: 0.14, physical: 0.07, defending: 0.03 },
    RW: { pace: 0.26, dribbling: 0.28, shooting: 0.22, passing: 0.14, physical: 0.07, defending: 0.03 },
    ST: { shooting: 0.34, physical: 0.18, pace: 0.18, dribbling: 0.16, passing: 0.1, defending: 0.04 }
  };

  const ATTRIBUTE_PRIORITIES = {
    GK: ["goalkeeping", "physical", "passing", "pace"],
    CB: ["defending", "physical", "pace", "passing"],
    LB: ["pace", "defending", "passing", "dribbling"],
    RB: ["pace", "defending", "passing", "dribbling"],
    DM: ["passing", "defending", "physical", "dribbling"],
    CM: ["passing", "dribbling", "physical", "defending"],
    AM: ["passing", "dribbling", "shooting", "pace"],
    LW: ["dribbling", "pace", "shooting", "passing"],
    RW: ["dribbling", "pace", "shooting", "passing"],
    ST: ["shooting", "physical", "pace", "dribbling"]
  };

  const PLAYER_NAME_POOL = [
    "马特奥",
    "伊桑",
    "卢卡",
    "诺亚",
    "阿德里安",
    "塞缪尔",
    "若昂",
    "尼科",
    "莱昂",
    "米洛"
  ];

  const AGENTS = [
    "周远",
    "林薇",
    "马尔科-罗西",
    "艾玛-贝克",
    "伊莎贝尔-桑托斯",
    "托马斯-霍夫曼"
  ];

  const FIRST_NAMES = [
    "阿尔瓦雷斯",
    "罗德里格斯",
    "桑托斯",
    "穆勒",
    "科斯塔",
    "费尔南德斯",
    "马丁内斯",
    "威尔逊",
    "伯纳德",
    "席尔瓦",
    "格林",
    "布鲁诺",
    "卡瓦略",
    "德容",
    "弗拉霍维奇",
    "佩雷拉"
  ];

  const REAL_PLAYER_POOLS = {
    arsenal: {
      scorers: ["布卡约·萨卡", "加布里埃尔·热苏斯", "凯·哈弗茨", "加布里埃尔·马丁内利"],
      creators: ["马丁·厄德高", "德克兰·赖斯", "布卡约·萨卡", "莱安德罗·特罗萨德"],
      stars: ["布卡约·萨卡", "马丁·厄德高", "德克兰·赖斯", "威廉·萨利巴"]
    },
    "man-city": {
      scorers: ["埃尔林·哈兰德", "菲尔·福登", "胡利安·阿尔瓦雷斯", "贝尔纳多·席尔瓦"],
      creators: ["凯文·德布劳内", "贝尔纳多·席尔瓦", "菲尔·福登", "罗德里"],
      stars: ["埃尔林·哈兰德", "罗德里", "凯文·德布劳内", "菲尔·福登"]
    },
    chelsea: {
      scorers: ["科尔·帕尔默", "尼古拉斯·杰克逊", "克里斯托弗·恩昆库", "拉希姆·斯特林"],
      creators: ["科尔·帕尔默", "恩佐·费尔南德斯", "莫伊塞斯·凯塞多", "克里斯托弗·恩昆库"],
      stars: ["科尔·帕尔默", "恩佐·费尔南德斯", "莫伊塞斯·凯塞多", "里斯·詹姆斯"]
    },
    liverpool: {
      scorers: ["穆罕默德·萨拉赫", "达尔文·努涅斯", "路易斯·迪亚斯", "科迪·加克波"],
      creators: ["穆罕默德·萨拉赫", "亚历克西斯·麦卡利斯特", "多米尼克·索博斯洛伊", "特伦特·亚历山大-阿诺德"],
      stars: ["穆罕默德·萨拉赫", "维吉尔·范戴克", "阿利松", "亚历克西斯·麦卡利斯特"]
    },
    tottenham: {
      scorers: ["孙兴慜", "詹姆斯·麦迪逊", "德扬·库卢塞夫斯基", "理查利森"],
      creators: ["詹姆斯·麦迪逊", "孙兴慜", "德扬·库卢塞夫斯基", "佩德罗·波罗"],
      stars: ["孙兴慜", "詹姆斯·麦迪逊", "克里斯蒂安·罗梅罗", "米基·范德文"]
    },
    "man-united": {
      scorers: ["马库斯·拉什福德", "布鲁诺·费尔南德斯", "拉斯穆斯·霍伊伦", "亚历杭德罗·加纳乔"],
      creators: ["布鲁诺·费尔南德斯", "克里斯蒂安·埃里克森", "梅森·芒特", "马库斯·拉什福德"],
      stars: ["布鲁诺·费尔南德斯", "马库斯·拉什福德", "科比·梅努", "利桑德罗·马丁内斯"]
    },
    "real-madrid": {
      scorers: ["基利安·姆巴佩", "维尼修斯", "罗德里戈", "裘德·贝林厄姆"],
      creators: ["裘德·贝林厄姆", "维尼修斯", "罗德里戈", "费德里科·巴尔韦德"],
      stars: ["基利安·姆巴佩", "维尼修斯", "裘德·贝林厄姆", "费德里科·巴尔韦德"]
    },
    barcelona: {
      scorers: ["罗伯特·莱万多夫斯基", "拉明·亚马尔", "拉菲尼亚", "费兰·托雷斯"],
      creators: ["佩德里", "拉明·亚马尔", "弗兰基·德容", "京多安"],
      stars: ["拉明·亚马尔", "佩德里", "罗伯特·莱万多夫斯基", "弗兰基·德容"]
    },
    atletico: {
      scorers: ["安托万·格列兹曼", "阿尔瓦罗·莫拉塔", "安赫尔·科雷亚", "孟菲斯·德佩"],
      creators: ["安托万·格列兹曼", "马科斯·略伦特", "科克", "罗德里戈·德保罗"],
      stars: ["安托万·格列兹曼", "扬·奥布拉克", "科克", "罗德里戈·德保罗"]
    },
    bayern: {
      scorers: ["哈里·凯恩", "贾马尔·穆西亚拉", "勒鲁瓦·萨内", "金斯利·科曼"],
      creators: ["贾马尔·穆西亚拉", "托马斯·穆勒", "约书亚·基米希", "勒鲁瓦·萨内"],
      stars: ["哈里·凯恩", "贾马尔·穆西亚拉", "约书亚·基米希", "曼努埃尔·诺伊尔"]
    },
    dortmund: {
      scorers: ["塞尔胡·吉拉西", "卡里姆·阿德耶米", "朱利安·布兰特", "多尼尔·马伦"],
      creators: ["朱利安·布兰特", "马塞尔·萨比策", "卡里姆·阿德耶米", "菲利克斯·恩梅查"],
      stars: ["朱利安·布兰特", "格雷戈尔·科贝尔", "尼科·施洛特贝克", "塞尔胡·吉拉西"]
    },
    leverkusen: {
      scorers: ["维克托·博尼费斯", "弗洛里安·维尔茨", "帕特里克·希克", "阿莱克斯·格里马尔多"],
      creators: ["弗洛里安·维尔茨", "阿莱克斯·格里马尔多", "杰里米·弗林蓬", "格拉尼特·扎卡"],
      stars: ["弗洛里安·维尔茨", "格拉尼特·扎卡", "阿莱克斯·格里马尔多", "杰里米·弗林蓬"]
    },
    leipzig: {
      scorers: ["本杰明·谢什科", "路易斯·奥彭达", "哈维·西蒙斯", "达尼·奥尔莫"],
      creators: ["哈维·西蒙斯", "达尼·奥尔莫", "大卫·劳姆", "克里斯托夫·鲍姆加特纳"],
      stars: ["哈维·西蒙斯", "路易斯·奥彭达", "本杰明·谢什科", "大卫·劳姆"]
    },
    psg: {
      scorers: ["奥斯曼·登贝莱", "贡萨洛·拉莫斯", "布拉德利·巴尔科拉", "马尔科·阿森西奥"],
      creators: ["维蒂尼亚", "奥斯曼·登贝莱", "李刚仁", "沃伦·扎伊尔-埃梅里"],
      stars: ["奥斯曼·登贝莱", "维蒂尼亚", "阿什拉夫·哈基米", "吉安路易吉·多纳鲁马"]
    },
    juventus: {
      scorers: ["杜尚·弗拉霍维奇", "费德里科·基耶萨", "阿卡迪乌什·米利克", "凯南·伊尔迪兹"],
      creators: ["费德里科·基耶萨", "特恩·库普梅纳斯", "曼努埃尔·洛卡特利", "安德烈亚·坎比亚索"],
      stars: ["杜尚·弗拉霍维奇", "费德里科·基耶萨", "布雷默", "特恩·库普梅纳斯"]
    },
    "ac-milan": {
      scorers: ["拉斐尔·莱奥", "克里斯蒂安·普利西奇", "奥利维耶·吉鲁", "卢卡·约维奇"],
      creators: ["拉斐尔·莱奥", "克里斯蒂安·普利西奇", "特奥·埃尔南德斯", "伊斯梅尔·本纳塞尔"],
      stars: ["拉斐尔·莱奥", "特奥·埃尔南德斯", "迈克·迈尼昂", "克里斯蒂安·普利西奇"]
    },
    inter: {
      scorers: ["劳塔罗·马丁内斯", "马库斯·图拉姆", "哈坎·恰尔汗奥卢", "尼科洛·巴雷拉"],
      creators: ["尼科洛·巴雷拉", "哈坎·恰尔汗奥卢", "费德里科·迪马尔科", "亨里克·姆希塔良"],
      stars: ["劳塔罗·马丁内斯", "尼科洛·巴雷拉", "哈坎·恰尔汗奥卢", "亚历山德罗·巴斯托尼"]
    },
    napoli: {
      scorers: ["维克托·奥斯梅恩", "赫维恰·克瓦拉茨赫利亚", "贾科莫·拉斯帕多里", "马泰奥·波利塔诺"],
      creators: ["赫维恰·克瓦拉茨赫利亚", "斯坦尼斯拉夫·洛博特卡", "皮奥特尔·泽林斯基", "马泰奥·波利塔诺"],
      stars: ["维克托·奥斯梅恩", "赫维恰·克瓦拉茨赫利亚", "斯坦尼斯拉夫·洛博特卡", "乔瓦尼·迪洛伦佐"]
    },
    benfica: {
      scorers: ["安赫尔·迪马利亚", "拉法·席尔瓦", "阿图尔·卡布拉尔", "贡萨洛·拉莫斯"],
      creators: ["安赫尔·迪马利亚", "若昂·内维斯", "奥尔昆·柯克曲", "弗雷德里克·奥尔斯内斯"],
      stars: ["安赫尔·迪马利亚", "若昂·内维斯", "奥尔昆·柯克曲", "安东尼奥·席尔瓦"]
    },
    porto: {
      scorers: ["梅赫迪·塔雷米", "埃瓦尼尔森", "弗朗西斯科·孔塞桑", "加莱诺"],
      creators: ["佩佩", "弗朗西斯科·孔塞桑", "加莱诺", "尼科·冈萨雷斯"],
      stars: ["迪奥戈·科斯塔", "佩佩", "加莱诺", "弗朗西斯科·孔塞桑"]
    },
    sporting: {
      scorers: ["维克托·哲凯赖什", "佩德罗·贡萨尔维斯", "弗朗西斯科·特林康", "保利尼奥"],
      creators: ["佩德罗·贡萨尔维斯", "弗朗西斯科·特林康", "守田英正", "米格尔·夸雷斯马"],
      stars: ["维克托·哲凯赖什", "佩德罗·贡萨尔维斯", "贡萨洛·伊纳西奥", "守田英正"]
    },
    ajax: {
      scorers: ["布赖恩·布罗贝伊", "史蒂文·贝尔温", "楚巴·阿克蓬", "克里斯蒂安·赫林森"],
      creators: ["史蒂文·贝尔温", "肯尼斯·泰勒", "约雷尔·哈托", "布兰科·范登博门"],
      stars: ["布赖恩·布罗贝伊", "史蒂文·贝尔温", "约雷尔·哈托", "肯尼斯·泰勒"]
    },
    psv: {
      scorers: ["卢克·德容", "约翰·巴卡约科", "诺亚·朗", "马利克·蒂尔曼"],
      creators: ["乔伊·费尔曼", "约翰·巴卡约科", "马利克·蒂尔曼", "诺亚·朗"],
      stars: ["卢克·德容", "乔伊·费尔曼", "约翰·巴卡约科", "杰尔迪·斯豪滕"]
    },
    feyenoord: {
      scorers: ["圣地亚哥·希门尼斯", "伊戈尔·派尚", "昆滕·廷贝尔", "扬库巴·明特"],
      creators: ["昆滕·廷贝尔", "伊戈尔·派尚", "卡尔文·斯滕斯", "卢特沙雷尔·海特勒伊达"],
      stars: ["圣地亚哥·希门尼斯", "昆滕·廷贝尔", "大卫·汉茨科", "卢特沙雷尔·海特勒伊达"]
    }
  };

  const CLUBS = [
    ["arsenal", "阿森纳", "premier", 86, 92, "elite"],
    ["man-city", "曼城", "premier", 91, 96, "elite"],
    ["chelsea", "切尔西", "premier", 83, 88, "elite"],
    ["liverpool", "利物浦", "premier", 88, 94, "elite"],
    ["tottenham", "热刺", "premier", 82, 86, "elite"],
    ["man-united", "曼联", "premier", 84, 91, "elite"],
    ["newcastle", "纽卡斯尔联", "premier", 82, 84, "standard"],
    ["aston-villa", "阿斯顿维拉", "premier", 81, 82, "standard"],
    ["brighton", "布莱顿", "premier", 78, 77, "standard"],
    ["west-ham", "西汉姆联", "premier", 77, 76, "standard"],
    ["crystal-palace", "水晶宫", "premier", 76, 73, "standard"],
    ["everton", "埃弗顿", "premier", 75, 74, "standard"],
    ["fulham", "富勒姆", "premier", 75, 72, "standard"],
    ["wolves", "狼队", "premier", 74, 72, "standard"],
    ["brentford", "布伦特福德", "premier", 74, 72, "standard"],
    ["nottingham", "诺丁汉森林", "premier", 73, 72, "standard"],
    ["bournemouth", "伯恩茅斯", "premier", 73, 70, "standard"],
    ["leeds", "利兹联", "premier", 72, 74, "small"],
    ["burnley", "伯恩利", "premier", 70, 68, "small"],
    ["sunderland", "桑德兰", "premier", 70, 68, "small"],

    ["real-madrid", "皇家马德里", "laliga", 91, 98, "elite"],
    ["barcelona", "巴塞罗那", "laliga", 88, 96, "elite"],
    ["atletico", "马德里竞技", "laliga", 86, 90, "elite"],
    ["athletic", "毕尔巴鄂竞技", "laliga", 81, 79, "standard"],
    ["villarreal", "比利亚雷亚尔", "laliga", 80, 80, "standard"],
    ["sevilla", "塞维利亚", "laliga", 79, 82, "standard"],
    ["valencia", "瓦伦西亚", "laliga", 77, 78, "standard"],
    ["betis", "皇家贝蒂斯", "laliga", 79, 80, "standard"],
    ["real-sociedad", "皇家社会", "laliga", 81, 82, "standard"],
    ["girona", "赫罗纳", "laliga", 78, 76, "standard"],
    ["celta", "塞尔塔", "laliga", 75, 72, "standard"],
    ["osasuna", "奥萨苏纳", "laliga", 74, 70, "standard"],
    ["getafe", "赫塔费", "laliga", 73, 70, "standard"],
    ["rayo", "巴列卡诺", "laliga", 73, 69, "standard"],
    ["mallorca", "马略卡", "laliga", 73, 69, "standard"],
    ["espanyol", "西班牙人", "laliga", 72, 70, "small"],
    ["levante", "莱万特", "laliga", 70, 68, "small"],
    ["elche", "埃尔切", "laliga", 70, 67, "small"],
    ["alaves", "阿拉维斯", "laliga", 71, 68, "small"],
    ["las-palmas", "拉斯帕尔马斯", "laliga", 70, 67, "small"],

    ["bayern", "拜仁慕尼黑", "bundesliga", 90, 97, "elite"],
    ["dortmund", "多特蒙德", "bundesliga", 85, 91, "elite"],
    ["leverkusen", "勒沃库森", "bundesliga", 86, 87, "small"],
    ["leipzig", "RB莱比锡", "bundesliga", 84, 86, "standard"],
    ["frankfurt", "法兰克福", "bundesliga", 80, 78, "standard"],
    ["stuttgart", "斯图加特", "bundesliga", 80, 77, "standard"],
    ["freiburg", "弗赖堡", "bundesliga", 78, 74, "standard"],
    ["wolfsburg", "沃尔夫斯堡", "bundesliga", 77, 75, "standard"],
    ["gladbach", "门兴格拉德巴赫", "bundesliga", 76, 76, "standard"],
    ["mainz", "美因茨", "bundesliga", 75, 72, "standard"],
    ["hoffenheim", "霍芬海姆", "bundesliga", 75, 72, "standard"],
    ["union-berlin", "柏林联合", "bundesliga", 74, 72, "standard"],
    ["werder", "云达不莱梅", "bundesliga", 74, 72, "standard"],
    ["augsburg", "奥格斯堡", "bundesliga", 73, 70, "standard"],
    ["heidenheim", "海登海姆", "bundesliga", 72, 67, "small"],
    ["st-pauli", "圣保利", "bundesliga", 71, 68, "small"],
    ["hamburg", "汉堡", "bundesliga", 72, 73, "small"],
    ["koln", "科隆", "bundesliga", 72, 72, "small"],

    ["psg", "巴黎圣日尔曼", "ligue1", 89, 95, "elite"],
    ["marseille", "马赛", "ligue1", 81, 84, "standard"],
    ["lyon", "里昂", "ligue1", 80, 83, "standard"],
    ["monaco", "摩纳哥", "ligue1", 82, 84, "standard"],
    ["lille", "里尔", "ligue1", 80, 81, "standard"],
    ["lens", "朗斯", "ligue1", 79, 78, "standard"],
    ["nice", "尼斯", "ligue1", 79, 78, "standard"],
    ["rennes", "雷恩", "ligue1", 78, 77, "standard"],
    ["strasbourg", "斯特拉斯堡", "ligue1", 75, 72, "standard"],
    ["nantes", "南特", "ligue1", 74, 72, "standard"],
    ["toulouse", "图卢兹", "ligue1", 74, 71, "standard"],
    ["montpellier", "蒙彼利埃", "ligue1", 73, 71, "standard"],
    ["brest", "布雷斯特", "ligue1", 75, 72, "standard"],
    ["lorient", "洛里昂", "ligue1", 71, 68, "small"],
    ["auxerre", "欧塞尔", "ligue1", 71, 68, "small"],
    ["metz", "梅斯", "ligue1", 70, 67, "small"],
    ["angers", "昂热", "ligue1", 69, 66, "small"],
    ["le-havre", "勒阿弗尔", "ligue1", 69, 66, "small"],

    ["juventus", "尤文图斯", "seriea", 85, 91, "elite"],
    ["ac-milan", "AC米兰", "seriea", 84, 90, "elite"],
    ["inter", "国际米兰", "seriea", 88, 94, "elite"],
    ["napoli", "那不勒斯", "seriea", 84, 88, "elite"],
    ["roma", "罗马", "seriea", 82, 84, "standard"],
    ["lazio", "拉齐奥", "seriea", 81, 82, "standard"],
    ["atalanta", "亚特兰大", "seriea", 83, 84, "standard"],
    ["fiorentina", "佛罗伦萨", "seriea", 80, 79, "standard"],
    ["bologna", "博洛尼亚", "seriea", 80, 78, "standard"],
    ["torino", "都灵", "seriea", 76, 74, "standard"],
    ["udinese", "乌迪内斯", "seriea", 74, 72, "standard"],
    ["genoa", "热那亚", "seriea", 74, 72, "standard"],
    ["verona", "维罗纳", "seriea", 72, 69, "small"],
    ["cagliari", "卡利亚里", "seriea", 72, 69, "small"],
    ["sassuolo", "萨索洛", "seriea", 73, 71, "small"],
    ["parma", "帕尔马", "seriea", 72, 70, "small"],
    ["lecce", "莱切", "seriea", 71, 68, "small"],
    ["como", "科莫", "seriea", 72, 70, "small"],
    ["pisa", "比萨", "seriea", 70, 67, "small"],
    ["cremonese", "克雷莫内塞", "seriea", 69, 66, "small"],

    ["benfica", "本菲卡", "primeira", 83, 87, "small"],
    ["porto", "波尔图", "primeira", 82, 86, "standard"],
    ["sporting", "葡萄牙体育", "primeira", 83, 87, "standard"],
    ["braga", "布拉加", "primeira", 78, 78, "standard"],
    ["vitoria", "吉马良斯", "primeira", 74, 72, "standard"],
    ["boavista", "博阿维斯塔", "primeira", 70, 67, "small"],
    ["famalicao", "法马利康", "primeira", 72, 68, "small"],
    ["rio-ave", "里奥阿维", "primeira", 70, 67, "small"],
    ["casa-pia", "卡萨皮亚", "primeira", 70, 66, "small"],
    ["estoril", "埃斯托里尔", "primeira", 70, 66, "small"],
    ["arouca", "阿罗卡", "primeira", 70, 66, "small"],
    ["gil-vicente", "吉尔维森特", "primeira", 70, 66, "small"],
    ["moreirense", "莫雷伦斯", "primeira", 70, 66, "small"],
    ["nacional", "国民队", "primeira", 68, 64, "small"],
    ["farense", "法伦斯", "primeira", 68, 64, "small"],
    ["santa-clara", "圣克拉拉", "primeira", 69, 65, "small"],
    ["tondela", "通德拉", "primeira", 67, 63, "small"],
    ["avs", "AVS", "primeira", 67, 63, "small"],

    ["ajax", "阿贾克斯", "eredivisie", 81, 86, "small"],
    ["psv", "PSV埃因霍温", "eredivisie", 83, 86, "standard"],
    ["feyenoord", "费耶诺德", "eredivisie", 82, 85, "standard"],
    ["az", "阿尔克马尔", "eredivisie", 78, 78, "standard"],
    ["twente", "特温特", "eredivisie", 76, 75, "standard"],
    ["utrecht", "乌德勒支", "eredivisie", 75, 74, "standard"],
    ["heerenveen", "海伦芬", "eredivisie", 71, 69, "small"],
    ["groningen", "格罗宁根", "eredivisie", 70, 68, "small"],
    ["sparta", "鹿特丹斯巴达", "eredivisie", 70, 68, "small"],
    ["heracles", "赫拉克勒斯", "eredivisie", 69, 66, "small"],
    ["pec", "兹沃勒", "eredivisie", 69, 66, "small"],
    ["nec", "奈梅亨", "eredivisie", 70, 68, "small"],
    ["willem", "威廉二世", "eredivisie", 69, 66, "small"],
    ["go-ahead", "前进之鹰", "eredivisie", 71, 69, "small"],
    ["fortuna", "福图纳锡塔德", "eredivisie", 68, 65, "small"],
    ["rkc", "瓦尔韦克", "eredivisie", 67, 64, "small"],
    ["nac", "布雷达", "eredivisie", 68, 65, "small"],
    ["volendam", "福伦丹", "eredivisie", 67, 64, "small"],

    ["wrexham", "雷克瑟姆", "league-one", 64, 64, "small"],
    ["bolton", "博尔顿", "league-one", 63, 65, "small"],
    ["barnsley", "巴恩斯利", "league-one", 62, 62, "small"],
    ["charlton", "查尔顿", "league-one", 62, 63, "small"],
    ["reading", "雷丁", "league-one", 61, 62, "small"],
    ["blackpool", "布莱克浦", "league-one", 62, 62, "small"],
    ["lincoln", "林肯城", "league-one", 60, 58, "small"],
    ["orient", "莱顿东方", "league-one", 60, 57, "small"],
    ["wycombe", "韦康比", "league-one", 60, 57, "small"],
    ["mansfield", "曼斯菲尔德", "league-one", 59, 56, "small"],
    ["bristol-rovers", "布里斯托流浪", "league-one", 59, 56, "small"],
    ["exeter", "埃克塞特城", "league-one", 58, 55, "small"],
    ["notts-county", "诺茨郡", "league-two", 56, 57, "small"],
    ["bradford", "布拉德福德", "league-two", 56, 58, "small"],
    ["swindon", "斯温登", "league-two", 55, 56, "small"],
    ["gillingham", "吉林汉姆", "league-two", 55, 56, "small"],
    ["crewe", "克鲁", "league-two", 55, 55, "small"],
    ["tranmere", "特兰米尔", "league-two", 54, 55, "small"],
    ["walsall", "沃尔索尔", "league-two", 55, 55, "small"],
    ["colchester", "科尔切斯特", "league-two", 54, 54, "small"]
  ].map(([id, name, league, rating, reputation, tier]) => ({
    id,
    name,
    league,
    rating,
    reputation,
    tier
  }));

  const CLUB_BY_ID = Object.fromEntries(CLUBS.map((club) => [club.id, club]));
  const CLUB_BY_NAME = Object.fromEntries(CLUBS.map((club) => [club.name, club]));

  const LEAGUES = {
    premier: {
      name: "英超",
      country: "英格兰",
      level: 1,
      ucl: 4,
      uel: 1,
      uecl: 1,
      relegation: 3,
      note: "前 4 欧冠，第 5 欧联，第 6 欧协联，后 3 降级。"
    },
    laliga: {
      name: "西甲",
      country: "西班牙",
      level: 1,
      ucl: 4,
      uel: 1,
      uecl: 1,
      relegation: 3,
      note: "前 4 欧冠，第 5 欧联，第 6 欧协联，后 3 降级。"
    },
    bundesliga: {
      name: "德甲",
      country: "德国",
      level: 1,
      ucl: 4,
      uel: 1,
      uecl: 1,
      relegation: 2,
      playoff: 1,
      note: "前 4 欧冠，第 5 欧联，第 6 欧协联，后 2 降级，第 16 名附加赛。"
    },
    ligue1: {
      name: "法甲",
      country: "法国",
      level: 1,
      ucl: 3,
      uclQ: 1,
      uel: 1,
      uecl: 1,
      relegation: 2,
      playoff: 1,
      note: "前 3 欧冠，第 4 欧冠资格赛，第 5 欧联，第 6 欧协联，后 2 降级。"
    },
    seriea: {
      name: "意甲",
      country: "意大利",
      level: 1,
      ucl: 4,
      uel: 1,
      uecl: 1,
      relegation: 3,
      note: "前 4 欧冠，第 5 欧联，第 6 欧协联，后 3 降级。"
    },
    primeira: {
      name: "葡超",
      country: "葡萄牙",
      level: 1,
      ucl: 2,
      uclQ: 1,
      uel: 1,
      uecl: 1,
      relegation: 2,
      playoff: 1,
      note: "前 2 欧冠，第 3 欧冠资格赛，第 4 欧联，第 5 欧协联，后 2 降级。"
    },
    eredivisie: {
      name: "荷甲",
      country: "荷兰",
      level: 1,
      ucl: 2,
      uclQ: 1,
      uel: 1,
      uecl: 1,
      relegation: 2,
      playoff: 1,
      note: "前 2 欧冠，第 3 欧冠资格赛，第 4 欧联，第 5 欧协联，后 2 降级。"
    },
    "league-one": {
      name: "英甲",
      country: "英格兰",
      level: 3,
      promotion: 2,
      playoffPromotion: 4,
      relegation: 4,
      note: "前 2 升级，第 3-6 名升级附加赛，后 4 降级。"
    },
    "league-two": {
      name: "英乙",
      country: "英格兰",
      level: 4,
      promotion: 3,
      playoffPromotion: 4,
      relegation: 2,
      note: "前 3 升级，第 4-7 名升级附加赛，后 2 降级。"
    }
  };

  const EURO_BONUS_POOL = [
    ["premier", 26],
    ["laliga", 22],
    ["seriea", 20],
    ["bundesliga", 19],
    ["ligue1", 9],
    ["primeira", 5],
    ["eredivisie", 5]
  ];

  const stateContainer = {
    state: null,
    activeTab: "career",
    careerTimelineCollapsed: false,
    marketOffersCollapsed: false,
    honorSort: "time"
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  function seedFromTime() {
    if (window.crypto && window.crypto.getRandomValues) {
      const bucket = new Uint32Array(1);
      window.crypto.getRandomValues(bucket);
      return bucket[0] || Date.now();
    }
    return Date.now() >>> 0;
  }

  function random() {
    const state = stateContainer.state;
    if (!state) {
      return Math.random();
    }
    state.seed = (state.seed + 0x6d2b79f5) >>> 0;
    let t = state.seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function randomInt(min, max) {
    return Math.floor(random() * (max - min + 1)) + min;
  }

  function choice(list) {
    return list[Math.floor(random() * list.length)];
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function money(value) {
    if (value >= 100000000) return `€${(value / 100000000).toFixed(2)}亿`;
    if (value >= 10000) return `€${Math.round(value / 10000)}万`;
    return `€${Math.round(value)}`;
  }

  function wage(value) {
    return `€${Math.round(value / 1000)}k/周`;
  }

  function fmtDate(weekOffset = 0) {
    const state = stateContainer.state;
    if (!state) return "";
    const date = new Date(state.seasonYear, 6, 12 + (state.week + weekOffset) * 7);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function leagueTeams(leagueId) {
    return CLUBS.filter((club) => club.league === leagueId).map((club) => club.id);
  }

  function eliteAcademyClubs() {
    return ELITE_ACADEMY_NAMES.map((name) => CLUB_BY_NAME[name]).filter(Boolean);
  }

  function club(id) {
    return CLUB_BY_ID[id];
  }

  function positionName(positionId) {
    return POSITIONS.find((position) => position.id === positionId)?.name || positionId;
  }

  function positionLine(positionId) {
    return POSITIONS.find((position) => position.id === positionId)?.line || "attacker";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function addLog(type, text, tag = "career") {
    const state = stateContainer.state;
    state.logs.unshift({
      id: `${Date.now()}-${randomInt(1000, 9999)}`,
      date: fmtDate(),
      type,
      tag,
      text
    });
    state.logs = state.logs.slice(0, 180);
  }

  function saveGame(silent = false) {
    const state = stateContainer.state;
    if (!state) return;
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    if (!silent) {
      addLog("info", "游戏已手动存档。");
      render();
    }
  }

  function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    try {
      return normalizeLoadedState(JSON.parse(raw));
    } catch (error) {
      console.warn(error);
      return null;
    }
  }

  function normalizeLoadedState(loaded) {
    if (!loaded || !loaded.player) return loaded;
    if (typeof loaded.player.parentClubId === "undefined") loaded.player.parentClubId = null;
    if (typeof loaded.player.loanUntilSeasonYear === "undefined") loaded.player.loanUntilSeasonYear = null;
    if (loaded.player.parentClubId && !club(loaded.player.parentClubId)) loaded.player.parentClubId = null;
    if (!Array.isArray(loaded.player.honors)) loaded.player.honors = [];
    if (!loaded.player.careerStats) loaded.player.careerStats = freshCareerStats();
    normalizeCareerStats(loaded.player.careerStats);
    if (!loaded.player.national) loaded.player.national = normalizeNationalData(null);
    else loaded.player.national = normalizeNationalData(loaded.player.national);
    normalizeCareerHistory(loaded.player, loaded);
    if (!loaded.clubQualifications) loaded.clubQualifications = {};
    loaded.european = normalizeEuropeanState(loaded.european);
    if (loaded.version < 2 && loaded.player.attributes && loaded.player.position) {
      loaded.player.overall = Math.min(loaded.player.potential || 99, calculateOverall(loaded.player.attributes, loaded.player.position));
      loaded.version = 2;
    }
    if (!loaded.market) loaded.market = { isOpen: false, windowType: null, strategy: "stay", offers: [] };
    if (loaded.market.strategy === "leave") loaded.market.strategy = "transfer";
    if (!["stay", "minutes", "bigger", "loan", "transfer"].includes(loaded.market.strategy)) loaded.market.strategy = "stay";
    if (!Array.isArray(loaded.market.offers)) loaded.market.offers = [];
    if (typeof loaded.market.lastOfferWeek === "undefined") loaded.market.lastOfferWeek = null;
    if (typeof loaded.market.dealDone === "undefined") loaded.market.dealDone = false;
    if (!loaded.windows) loaded.windows = { summer: false, winter: false };
    if (!loaded.leagues) loaded.leagues = {};
    if (!Array.isArray(loaded.logs)) loaded.logs = [];
    if (!loaded.player.season) loaded.player.season = freshSeasonStats();
    if (typeof loaded.player.season.cleanSheets === "undefined") loaded.player.season.cleanSheets = 0;
    return loaded;
  }

  function createAttributes(positionId, overall) {
    const line = positionLine(positionId);
    const spread = () => randomInt(-4, 4);
    const base = {
      pace: overall + spread(),
      shooting: overall + spread(),
      passing: overall + spread(),
      dribbling: overall + spread(),
      defending: overall + spread(),
      physical: overall + spread(),
      goalkeeping: 22 + randomInt(0, 12)
    };
    if (line === "goalkeeper") {
      base.goalkeeping = overall + randomInt(1, 5);
      base.defending = overall - randomInt(4, 8);
      base.shooting = 20 + randomInt(0, 10);
      base.dribbling = overall - randomInt(12, 18);
    }
    if (line === "defender") {
      base.defending += randomInt(5, 9);
      base.physical += randomInt(2, 6);
      base.shooting -= randomInt(6, 10);
    }
    if (line === "midfielder") {
      base.passing += randomInt(4, 8);
      base.dribbling += randomInt(1, 5);
      base.shooting -= randomInt(1, 4);
    }
    if (line === "attacker") {
      base.shooting += randomInt(4, 9);
      base.dribbling += randomInt(2, 7);
      base.defending -= randomInt(6, 11);
    }
    Object.keys(base).forEach((key) => {
      base[key] = clamp(Math.round(base[key]), 15, 99);
    });
    return base;
  }

  function calculateOverall(attributes, positionId) {
    const weights = OVERALL_WEIGHTS[positionId] || OVERALL_WEIGHTS.CM;
    return Math.round(Object.entries(weights).reduce((sum, [key, weight]) => sum + attributes[key] * weight, 0));
  }

  function calculateValue(player) {
    const ageBoost = clamp((24 - player.age) * 0.08, -0.1, 0.72);
    const potentialBoost = clamp((player.potential - player.overall) * 0.055, 0, 1.3);
    const reputationBoost = player.reputation / 115;
    const starBoost = player.overall >= 84 ? 1 + (player.overall - 83) * 0.09 : 1;
    const base = Math.pow(Math.max(1, player.overall - 45), 2.25) * 6500;
    return Math.max(60000, Math.round(base * starBoost * (1 + ageBoost + potentialBoost + reputationBoost)));
  }

  function calculateWage(player, currentClub) {
    const prestige = currentClub.reputation / 100;
    const reputation = 1 + player.reputation / 95;
    const base = Math.pow(Math.max(1, player.overall - 40), 1.82) * 28;
    return Math.max(800, Math.round(base * reputation * (0.7 + prestige)));
  }

  function makeRoundRobin(teamIds) {
    const teams = teamIds.slice();
    if (teams.length % 2 === 1) teams.push("BYE");
    const rounds = [];
    let rotation = teams.slice();
    const total = rotation.length - 1;
    for (let round = 0; round < total; round += 1) {
      const matches = [];
      for (let i = 0; i < rotation.length / 2; i += 1) {
        const a = rotation[i];
        const b = rotation[rotation.length - 1 - i];
        if (a !== "BYE" && b !== "BYE") {
          const home = round % 2 === 0 ? a : b;
          const away = round % 2 === 0 ? b : a;
          matches.push({ home, away });
        }
      }
      rounds.push(matches);
      rotation = [rotation[0], rotation[rotation.length - 1], ...rotation.slice(1, rotation.length - 1)];
    }
    const mirrored = rounds.map((week) => week.map((match) => ({ home: match.away, away: match.home })));
    return rounds.concat(mirrored);
  }

  function createLeagueSeason(leagueId) {
    const teamIds = leagueTeams(leagueId);
    return {
      table: teamIds.map((teamId) => ({
        teamId,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        points: 0
      })),
      schedule: makeRoundRobin(teamIds),
      simulatedWeeks: 0
    };
  }

  function ensureLeagueSeason(leagueId) {
    const state = stateContainer.state;
    if (!state.leagues[leagueId]) {
      state.leagues[leagueId] = createLeagueSeason(leagueId);
    }
    return state.leagues[leagueId];
  }

  function drawEuroBonusLeagues() {
    const pool = EURO_BONUS_POOL.map(([leagueId, weight]) => ({ leagueId, weight }));
    const picked = [];
    while (picked.length < 2 && pool.length) {
      const total = pool.reduce((sum, entry) => sum + entry.weight, 0);
      let roll = random() * total;
      const index = pool.findIndex((entry) => {
        roll -= entry.weight;
        return roll <= 0;
      });
      const safeIndex = index >= 0 ? index : pool.length - 1;
      picked.push(pool[safeIndex].leagueId);
      pool.splice(safeIndex, 1);
    }
    return picked;
  }

  function effectiveRules(leagueId) {
    const state = stateContainer.state;
    const base = LEAGUES[leagueId];
    if (!base) return {};
    const rules = { ...base };
    if (state?.euroBonusLeagues?.includes(leagueId) && rules.ucl) {
      rules.ucl += 1;
    }
    return rules;
  }

  function leagueRuleNote(leagueId) {
    const state = stateContainer.state;
    const base = LEAGUES[leagueId]?.note || "";
    if (state?.euroBonusLeagues?.includes(leagueId) && LEAGUES[leagueId]?.ucl) {
      return `${base} 本赛季该联赛获得 1 个欧足联系数奖励欧冠席位，后续欧联/欧协联席位顺延。`;
    }
    return base;
  }

  function euroBonusSummary() {
    const state = stateContainer.state;
    const names = (state.euroBonusLeagues || []).map((leagueId) => LEAGUES[leagueId].name).join("、");
    return `本赛季欧足联系数奖励席位：${names}各获得 1 个额外欧冠席位。杯赛席位在本作以联赛顺延方式结算。`;
  }

  function sortedTable(leagueId) {
    const season = ensureLeagueSeason(leagueId);
    return season.table
      .slice()
      .sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf || club(b.teamId).rating - club(a.teamId).rating);
  }

  function updateTable(leagueId, homeId, awayId, homeGoals, awayGoals) {
    const table = ensureLeagueSeason(leagueId).table;
    const home = table.find((row) => row.teamId === homeId);
    const away = table.find((row) => row.teamId === awayId);
    home.played += 1;
    away.played += 1;
    home.gf += homeGoals;
    home.ga += awayGoals;
    away.gf += awayGoals;
    away.ga += homeGoals;
    home.gd = home.gf - home.ga;
    away.gd = away.gf - away.ga;
    if (homeGoals > awayGoals) {
      home.won += 1;
      away.lost += 1;
      home.points += 3;
    } else if (homeGoals < awayGoals) {
      away.won += 1;
      home.lost += 1;
      away.points += 3;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    }
  }

  function poisson(lambda) {
    const limit = Math.exp(-lambda);
    let p = 1;
    let k = 0;
    while (p > limit) {
      k += 1;
      p *= random();
    }
    return k - 1;
  }

  function pseudoRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function normalizeNationalData(national) {
    const base = national || {};
    return {
      caps: base.caps || 0,
      goals: base.goals || 0,
      assists: base.assists || 0,
      callUps: base.callUps || 0,
      season: base.season || { caps: 0, goals: 0, assists: 0 },
      matches: Array.isArray(base.matches) ? base.matches : []
    };
  }

  function normalizeEuropeanState(european) {
    if (!european) return null;
    const rawSchedule = Array.isArray(european.schedule) ? european.schedule : [];
    const legacyPremadeKnockout =
      !european.phase &&
      rawSchedule.some((match) => ["1/8决赛", "1/4决赛", "半决赛", "决赛"].includes(match.stage));
    const schedule = rawSchedule.map((match, index) => {
      const stage = legacyPremadeKnockout ? "联赛阶段" : match.stage === "小组赛" ? "联赛阶段" : match.stage || "联赛阶段";
      const phase = match.phase || (stage === "联赛阶段" ? "league" : "knockout");
      return {
        ...match,
        stage,
        phase,
        week: typeof match.week === "number" ? match.week : index * 3 + 2,
        played: !!match.played,
        homeGoals: match.homeGoals || 0,
        awayGoals: match.awayGoals || 0
      };
    });
    const participants = Array.isArray(european.participants)
      ? european.participants
      : Array.from(new Set([european.clubId, ...schedule.flatMap((match) => [match.home, match.away])].filter(Boolean)));
    const won = !!european.won;
    const eliminated = legacyPremadeKnockout ? false : !!european.eliminated;
    return {
      competition: european.competition,
      clubId: european.clubId,
      phase: european.phase || (won || eliminated ? "finished" : "league"),
      currentRound: european.currentRound || (won || eliminated ? "结束" : "联赛阶段"),
      leagueRank: european.leagueRank || null,
      won,
      eliminated,
      participants,
      standingsSeed: european.standingsSeed || 0,
      schedule,
      stats: european.stats || { appearances: 0, goals: 0, assists: 0, ratingTotal: 0, ratedMatches: 0 }
    };
  }

  function refreshClubQualifications() {
    const state = stateContainer.state;
    if (!state) return;
    state.clubQualifications = state.clubQualifications || {};
    Object.keys(LEAGUES).forEach((leagueId) => {
      if (LEAGUES[leagueId].level !== 1) return;
      ensureLeagueSeason(leagueId);
      const rows = sortedTable(leagueId);
      rows.forEach((row, index) => {
        const label = placementLabel(leagueId, index + 1, rows.length);
        if (["欧冠", "欧冠资格赛", "欧联", "欧协联"].includes(label)) {
          state.clubQualifications[row.teamId] = label;
        } else {
          delete state.clubQualifications[row.teamId];
        }
      });
    });
  }

  function clubEuropeanProspectLabel(clubId) {
    const state = stateContainer.state;
    const target = club(clubId);
    if (!target || LEAGUES[target.league]?.level !== 1) return "";
    const stored = state?.clubQualifications?.[clubId];
    if (stored) return stored;
    ensureLeagueSeason(target.league);
    const rows = sortedTable(target.league);
    const rank = rows.findIndex((row) => row.teamId === clubId) + 1;
    if (!rank) return "";
    const label = placementLabel(target.league, rank, rows.length);
    return ["欧冠", "欧冠资格赛", "欧联", "欧协联"].includes(label) ? label : "";
  }

  function playerPoolForRole(pool, role) {
    if (!pool) return null;
    if (role.includes("scorer")) return pool.scorers || pool.stars || pool.creators;
    if (role.includes("creator")) return pool.creators || pool.stars || pool.scorers;
    return pool.stars || pool.creators || pool.scorers;
  }

  function generatedPlayerName(team, role, seed) {
    const realPool = playerPoolForRole(REAL_PLAYER_POOLS[team.id], role);
    if (realPool?.length) {
      return realPool[Math.floor(pseudoRandom(seed + role.length + team.id.length) * realPool.length)];
    }
    const first = PLAYER_NAME_POOL[Math.floor(pseudoRandom(seed + role.length) * PLAYER_NAME_POOL.length)];
    const last = FIRST_NAMES[Math.floor(pseudoRandom(seed + team.name.length * 3) * FIRST_NAMES.length)];
    return `${first}·${last}`;
  }

  function buildLeagueLeaderboards(leagueId) {
    const state = stateContainer.state;
    const player = state.player;
    const rows = sortedTable(leagueId);
    const scorers = [];
    const assisters = [];
    const ratings = [];

    rows.forEach((row) => {
      const team = club(row.teamId);
      const seed = row.teamId.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) + state.seasonYear * 13 + row.played * 7;
      let teamGoals = row.gf;
      let teamAssists = Math.max(0, Math.round(row.gf * 0.72 + row.played * 0.18));
      if (row.teamId === player.clubId) {
        teamGoals = Math.max(0, teamGoals - player.season.goals);
        teamAssists = Math.max(0, teamAssists - player.season.assists);
      }
      const npcGoals = Math.max(0, Math.min(teamGoals, Math.round(teamGoals * (0.34 + pseudoRandom(seed) * 0.18))));
      const npcAssists = Math.max(0, Math.min(teamAssists, Math.round(teamAssists * (0.32 + pseudoRandom(seed + 17) * 0.16))));
      const npcRating = clamp(6.15 + (team.rating - 70) * 0.04 + pseudoRandom(seed + 31) * 0.55, 5.8, 7.8);
      if (npcGoals > 0 || row.played > 0) {
        scorers.push({ name: generatedPlayerName(team, "scorer", seed), team: team.name, goals: npcGoals, isUser: false });
      }
      if (npcAssists > 0 || row.played > 0) {
        assisters.push({ name: generatedPlayerName(team, "creator", seed + 17), team: team.name, assists: npcAssists, isUser: false });
      }
      ratings.push({ name: generatedPlayerName(team, "star", seed + 31), team: team.name, rating: npcRating, isUser: false });
    });

    if (currentClub().league === leagueId && player.season.appearances > 0) {
      const avgRating = player.season.ratedMatches ? player.season.ratingTotal / player.season.ratedMatches : 0;
      scorers.push({ name: player.name, team: currentClub().name, goals: player.season.goals, isUser: true });
      assisters.push({ name: player.name, team: currentClub().name, assists: player.season.assists, isUser: true });
      if (avgRating > 0) {
        ratings.push({ name: player.name, team: currentClub().name, rating: avgRating, isUser: true });
      }
    }

    scorers.sort((a, b) => b.goals - a.goals || Number(b.isUser) - Number(a.isUser));
    assisters.sort((a, b) => b.assists - a.assists || Number(b.isUser) - Number(a.isUser));
    ratings.sort((a, b) => b.rating - a.rating || Number(b.isUser) - Number(a.isUser));
    return {
      scorers: scorers.slice(0, 12),
      assisters: assisters.slice(0, 12),
      ratings: ratings.slice(0, 12)
    };
  }

  function leagueTopGoals(leagueId) {
    const leaders = buildLeagueLeaderboards(leagueId).scorers;
    return leaders.length ? leaders[0].goals : 0;
  }

  function europeanCandidateLabels(competition) {
    if (competition === "欧冠") return ["欧冠", "欧冠资格赛"];
    if (competition === "欧联") return ["欧联"];
    if (competition === "欧协联") return ["欧协联"];
    return ["欧冠", "欧冠资格赛", "欧联", "欧协联"];
  }

  function europeanOpponentPool(competition, clubId) {
    const state = stateContainer.state;
    const labels = europeanCandidateLabels(competition);
    const qualified = Object.entries(state.clubQualifications || {})
      .filter(([id, label]) => id !== clubId && labels.includes(label))
      .map(([id]) => club(id))
      .filter(Boolean);
    const ratingFloor = competition === "欧冠" ? 80 : competition === "欧联" ? 75 : 71;
    const fallback = CLUBS.filter(
      (entry) => entry.id !== clubId && LEAGUES[entry.league]?.level === 1 && entry.rating >= ratingFloor
    );
    const merged = [];
    [...qualified, ...fallback].forEach((team) => {
      if (!merged.some((entry) => entry.id === team.id)) merged.push(team);
    });
    return merged.sort((a, b) => {
      const scoreA = a.rating * 1.4 + a.reputation + pseudoRandom(state.seasonYear + a.id.length) * 8;
      const scoreB = b.rating * 1.4 + b.reputation + pseudoRandom(state.seasonYear + b.id.length) * 8;
      return scoreB - scoreA;
    });
  }

  function europeanLeagueMatchCount(competition) {
    return competition === "欧协联" ? 6 : 8;
  }

  function europeanLeagueWeeks(competition) {
    return europeanLeagueMatchCount(competition) === 6 ? [2, 6, 10, 14, 18, 22] : [2, 5, 8, 11, 14, 17, 20, 23];
  }

  function isEuropeanLeagueMatch(match) {
    if (!match) return false;
    return (match.phase || (match.stage === "联赛阶段" || match.stage === "小组赛" ? "league" : "knockout")) === "league";
  }

  function europeanFieldPool(competition, clubId) {
    const merged = [];
    const addTeam = (team) => {
      if (team && team.id !== clubId && LEAGUES[team.league]?.level === 1 && !merged.some((entry) => entry.id === team.id)) {
        merged.push(team);
      }
    };
    europeanOpponentPool(competition, clubId).forEach(addTeam);
    CLUBS.slice()
      .sort((a, b) => b.rating - a.rating || b.reputation - a.reputation)
      .forEach(addTeam);
    return merged;
  }

  function ensureEuropeanLeagueSchedule(euro) {
    if (!euro || euro.phase !== "league" || euro.eliminated || euro.won) return;
    const matchCount = europeanLeagueMatchCount(euro.competition);
    const weeks = europeanLeagueWeeks(euro.competition);
    const leagueMatches = euro.schedule.filter(isEuropeanLeagueMatch);
    if (leagueMatches.length >= matchCount) return;
    const usedOpponents = new Set(
      leagueMatches.flatMap((match) => [match.home, match.away]).filter((id) => id && id !== euro.clubId)
    );
    const available = europeanFieldPool(euro.competition, euro.clubId).filter((team) => !usedOpponents.has(team.id));
    while (leagueMatches.length < matchCount && available.length) {
      const opponent = available.shift();
      const index = leagueMatches.length;
      const week = weeks[index] ?? ((leagueMatches[leagueMatches.length - 1]?.week ?? 20) + 3);
      leagueMatches.push({
        week,
        stage: "联赛阶段",
        phase: "league",
        home: index % 2 === 0 ? euro.clubId : opponent.id,
        away: index % 2 === 0 ? opponent.id : euro.clubId,
        played: false,
        homeGoals: 0,
        awayGoals: 0
      });
    }
    const knockoutMatches = euro.schedule.filter((match) => !isEuropeanLeagueMatch(match));
    euro.schedule = leagueMatches.concat(knockoutMatches).sort((a, b) => a.week - b.week);
    euro.participants = Array.from(new Set([euro.clubId, ...(euro.participants || []), ...available.map((team) => team.id), ...euro.schedule.flatMap((match) => [match.home, match.away])].filter(Boolean)));
  }

  function setupEuropeanCampaign(competition, clubId) {
    const state = stateContainer.state;
    if (!competition || !clubId || LEAGUES[club(clubId).league]?.level !== 1) {
      state.european = null;
      return;
    }
    refreshClubQualifications();
    const field = europeanFieldPool(competition, clubId);
    const matchCount = europeanLeagueMatchCount(competition);
    const opponents = field
      .slice(0, 18)
      .sort(() => random() - 0.5)
      .slice(0, matchCount);
    if (opponents.length < matchCount) {
      state.european = null;
      return;
    }
    const weeks = europeanLeagueWeeks(competition);
    const participants = [clubId, ...field.slice(0, 35).map((team) => team.id)];
    state.european = {
      competition,
      clubId,
      phase: "league",
      currentRound: "联赛阶段",
      leagueRank: null,
      won: false,
      eliminated: false,
      participants,
      standingsSeed: randomInt(1000, 9999),
      schedule: weeks.map((week, index) => ({
        week,
        stage: "联赛阶段",
        phase: "league",
        home: index % 2 === 0 ? clubId : opponents[index].id,
        away: index % 2 === 0 ? opponents[index].id : clubId,
        played: false,
        homeGoals: 0,
        awayGoals: 0
      })),
      stats: { appearances: 0, goals: 0, assists: 0, ratingTotal: 0, ratedMatches: 0 }
    };
  }

  function getEuropeanMatchForWeek(week) {
    const euro = stateContainer.state?.european;
    if (!euro || euro.eliminated || euro.won) return null;
    const nextMatch = euro.schedule
      .filter((match) => !match.played)
      .sort((a, b) => a.week - b.week)[0];
    if (!nextMatch) return null;
    const own = currentClub();
    const leagueSeason = ensureLeagueSeason(own.league);
    return nextMatch.week <= week || week >= leagueSeason.schedule.length ? nextMatch : null;
  }

  function getNextEuropeanMatch() {
    const state = stateContainer.state;
    const euro = state?.european;
    if (!euro || euro.eliminated || euro.won) return null;
    return euro.schedule
      .filter((match) => !match.played)
      .sort((a, b) => a.week - b.week)[0] || null;
  }

  function nextEuropeanKnockoutRound(stage) {
    return {
      淘汰赛附加赛: "1/8决赛",
      "1/8决赛": "1/4决赛",
      "1/4决赛": "半决赛",
      半决赛: "决赛"
    }[stage] || null;
  }

  function europeanKnockoutOpponent(euro, stage) {
    const standings = buildEuropeanStandings(euro);
    const ownRank = standings.findIndex((row) => row.teamId === euro.clubId) + 1;
    let pool = standings;
    if (stage === "淘汰赛附加赛") pool = standings.slice(8, 24);
    if (stage === "1/8决赛") pool = ownRank <= 8 ? standings.slice(8, 24) : standings.slice(0, 8);
    if (["1/4决赛", "半决赛", "决赛"].includes(stage)) pool = standings.slice(0, Math.min(16, standings.length));
    const usedKnockoutOpponents = new Set(
      euro.schedule
        .filter((match) => !isEuropeanLeagueMatch(match))
        .flatMap((match) => [match.home, match.away])
        .filter((id) => id && id !== euro.clubId)
    );
    const candidates = pool
      .map((row) => row.teamId)
      .filter((teamId) => teamId !== euro.clubId && !usedKnockoutOpponents.has(teamId));
    const fallback = standings.map((row) => row.teamId).filter((teamId) => teamId !== euro.clubId);
    const picked = (candidates.length ? candidates : fallback).sort((a, b) => {
      const seed = (euro.standingsSeed || 0) + stateContainer.state.week * 11 + stage.length;
      return club(b).rating + pseudoRandom(seed + b.length) * 4 - (club(a).rating + pseudoRandom(seed + a.length) * 4);
    })[0];
    return picked || europeanFieldPool(euro.competition, euro.clubId)[0]?.id || null;
  }

  function scheduleEuropeanKnockoutMatch(euro, stage, baseWeek) {
    if (!stage || euro.schedule.some((match) => !match.played && match.stage === stage)) return null;
    const opponentId = europeanKnockoutOpponent(euro, stage);
    if (!opponentId) return null;
    const latestWeek = Math.max(0, ...euro.schedule.map((match) => match.week || 0));
    const week = Math.max(baseWeek + 2, latestWeek + 2);
    const home = random() < 0.5 ? euro.clubId : opponentId;
    const away = home === euro.clubId ? opponentId : euro.clubId;
    const match = {
      week,
      stage,
      phase: "knockout",
      home,
      away,
      played: false,
      homeGoals: 0,
      awayGoals: 0
    };
    euro.schedule.push(match);
    euro.schedule.sort((a, b) => a.week - b.week);
    euro.participants = Array.from(new Set([...(euro.participants || []), opponentId, euro.clubId]));
    euro.phase = "knockout";
    euro.currentRound = stage;
    return match;
  }

  function resolveEuropeanLeaguePhase(euro, baseWeek, silent = false) {
    const leagueMatches = euro.schedule.filter(isEuropeanLeagueMatch);
    if (!leagueMatches.length || !leagueMatches.every((match) => match.played)) return false;
    const standings = buildEuropeanStandings(euro);
    const rank = standings.findIndex((row) => row.teamId === euro.clubId) + 1;
    euro.leagueRank = rank || null;
    if (rank > 0 && rank <= 8) {
      scheduleEuropeanKnockoutMatch(euro, "1/8决赛", baseWeek);
      if (!silent) addLog("positive", `${euro.competition}联赛阶段结束：${currentClub().name}排名第 ${rank}，直接进入 16 强。`, "match");
      return true;
    }
    if (rank > 8 && rank <= 24) {
      scheduleEuropeanKnockoutMatch(euro, "淘汰赛附加赛", baseWeek);
      if (!silent) addLog("info", `${euro.competition}联赛阶段结束：${currentClub().name}排名第 ${rank}，进入淘汰赛附加赛。`, "match");
      return true;
    }
    euro.eliminated = true;
    euro.phase = "finished";
    euro.currentRound = "联赛阶段";
    if (!silent) addLog("negative", `${euro.competition}联赛阶段结束：${currentClub().name}排名第 ${rank || "-"}，未能进入淘汰赛。`, "match");
    return true;
  }

  function advanceEuropeanCampaignAfterMatch(euro, match, won, drawn) {
    if (isEuropeanLeagueMatch(match)) {
      resolveEuropeanLeaguePhase(euro, match.week);
      return;
    }
    const survived = won || (drawn && random() < (currentClub().rating >= club(match.home === euro.clubId ? match.away : match.home).rating ? 0.56 : 0.44));
    if (drawn) match.tiebreak = survived ? "点球晋级" : "点球出局";
    if (!survived) {
      euro.eliminated = true;
      euro.phase = "finished";
      euro.currentRound = match.stage;
      addLog("negative", `${euro.competition}${match.stage}结束：${currentClub().name}${drawn ? "点球大战失利" : "被淘汰"}。`, "match");
      return;
    }
    if (match.stage === "决赛") {
      euro.won = true;
      euro.phase = "finished";
      euro.currentRound = "冠军";
      addLog("positive", `${euro.competition}决赛结束：${currentClub().name}夺得冠军！`, "match");
      return;
    }
    const nextRound = nextEuropeanKnockoutRound(match.stage);
    if (nextRound) {
      scheduleEuropeanKnockoutMatch(euro, nextRound, match.week);
      addLog("positive", `${euro.competition}${match.stage}过关：下一轮是${nextRound}。`, "match");
    }
  }

  function simulateEuropeanMatch(match, detailed) {
    const state = stateContainer.state;
    const own = currentClub();
    const euro = state.european;
    if (!euro || euro.clubId !== own.id || euro.eliminated || euro.won || !match || match.played) return;

    const isHome = match.home === own.id;
    const opponent = club(isHome ? match.away : match.home);
    const minutes = determineMinutes({ home: match.home, away: match.away });
    const importance = euro.competition === "欧冠" ? 0.25 : euro.competition === "欧联" ? 0.18 : 0.12;
    const contribution = contributionFromPerformance(minutes, opponent.rating, importance);
    const playerBoost = minutes > 0 ? (contribution.rating - 6.4) * 1.15 + contribution.goals * 0.75 + contribution.assists * 0.38 : -0.35;
    let score = simulateScore(match.home, match.away, isHome ? playerBoost : -playerBoost * 0.65);
    if (isHome) {
      score.homeGoals += contribution.goals;
      score.homeGoals += Math.min(contribution.assists, random() < 0.72 ? contribution.assists : 0);
    } else {
      score.awayGoals += contribution.goals;
      score.awayGoals += Math.min(contribution.assists, random() < 0.72 ? contribution.assists : 0);
    }
    const ownGoals = isHome ? score.homeGoals : score.awayGoals;
    const oppGoals = isHome ? score.awayGoals : score.homeGoals;
    const won = ownGoals > oppGoals;
    const drawn = ownGoals === oppGoals;
    Object.assign(
      contribution,
      finalizeMatchContribution(contribution, {
        won,
        drawn,
        ownGoals,
        oppGoals,
        isGoalkeeper: positionLine(state.player.position) === "goalkeeper"
      })
    );

    match.played = true;
    match.homeGoals = score.homeGoals;
    match.awayGoals = score.awayGoals;
    if (minutes > 0) {
      euro.stats.appearances += 1;
      euro.stats.goals += contribution.goals;
      euro.stats.assists += contribution.assists;
      euro.stats.ratingTotal += contribution.rating;
      euro.stats.ratedMatches += 1;
      state.player.form = clamp(state.player.form + (contribution.rating - 6.6) * 0.55 + (won ? 0.8 : drawn ? 0.1 : -0.8), -8, 8);
      const resultMorale = won ? 4 : drawn ? 1 : -3;
      const ratingMorale = contribution.rating > 7.4 ? 4 : contribution.rating < 5.8 ? -2 : contribution.rating < 6.2 ? -1 : 0;
      state.player.morale = clamp(state.player.morale + resultMorale + ratingMorale, 0, 100);
      state.attitudes.manager = clamp(state.attitudes.manager + (contribution.rating - 6.5) * 1.5 + (won ? 1 : drawn ? 0 : -1), 0, 100);
      state.attitudes.fans = clamp(state.attitudes.fans + contribution.goals * 2.2 + contribution.assists * 1.4 + (won ? 1.5 : drawn ? 0 : -1.5), 0, 100);
      state.attitudes.teammates = clamp(state.attitudes.teammates + (contribution.rating - 6.5) * 0.9 + (contribution.assists ? 1.3 : 0), 0, 100);
      state.player.careerStats.europeanGoals += contribution.goals;
      if (euro.competition === "欧冠") state.player.careerStats.uclGoals += contribution.goals;
      const euroXpBonus = euro.competition === "欧冠" ? 18 : euro.competition === "欧联" ? 14 : 10;
      state.player.xp += contribution.xp + euroXpBonus;
      maybeImprovePlayer();
    } else {
      state.player.form = clamp(state.player.form - 0.25, -8, 8);
      state.player.morale = clamp(state.player.morale - 1, 0, 100);
      state.attitudes.manager = clamp(state.attitudes.manager - 0.4, 0, 100);
    }
    state.player.fatigue = clamp(state.player.fatigue + Math.round(minutes * 0.2) + randomInt(1, 5), 0, 100);
    state.player.value = calculateValue(state.player);
    state.player.wage = calculateWage(state.player, own);

    const resultText = `${own.name} ${ownGoals}-${oppGoals} ${opponent.name}`;
    advanceEuropeanCampaignAfterMatch(euro, match, won, drawn);

    addLog(won ? "positive" : drawn ? "info" : "negative", `${euro.competition} ${match.stage}：${resultText}${match.tiebreak ? `（${match.tiebreak}）` : ""}。${contribution.text}欧战成长 +${minutes > 0 ? contribution.xp + (euro.competition === "欧冠" ? 18 : euro.competition === "欧联" ? 14 : 10) : 0}。`, "match");
    if (detailed) {
      const commentary = buildCommentary(own, opponent, ownGoals, oppGoals, contribution, isHome, won, drawn);
      commentary.reverse().forEach((line) => addLog("info", `${euro.competition}${match.stage} · ${line}`, "match"));
    }
    maybeCreateMediaEvent(contribution, won, drawn, `${euro.competition} ${match.stage} ${resultText}`, ownGoals, oppGoals, !isEuropeanLeagueMatch(match));
  }

  function simulateEuropeanWeekIfDue(detailed) {
    const state = stateContainer.state;
    const euro = state.european;
    if (!euro || euro.clubId !== currentClub().id || euro.eliminated || euro.won) return;
    simulateEuropeanMatch(getEuropeanMatchForWeek(state.week), detailed);
  }

  function simulateScore(homeId, awayId, playerBoost = 0) {
    const home = club(homeId);
    const away = club(awayId);
    const diff = home.rating + 2.8 + playerBoost - away.rating;
    const homeLambda = clamp(1.3 + diff / 24, 0.25, 3.4);
    const awayLambda = clamp(1.05 - diff / 28, 0.2, 3.1);
    return {
      homeGoals: poisson(homeLambda),
      awayGoals: poisson(awayLambda)
    };
  }

  function currentClub() {
    return club(stateContainer.state.player.clubId);
  }

  function parentClub() {
    const player = stateContainer.state?.player;
    return player?.parentClubId ? club(player.parentClubId) : null;
  }

  function contractClub() {
    return parentClub() || currentClub();
  }

  function getNextMatch() {
    const state = stateContainer.state;
    const current = currentClub();
    const leagueSeason = ensureLeagueSeason(current.league);
    const weekMatches = leagueSeason.schedule[state.week] || [];
    const leagueMatch = weekMatches.find((match) => match.home === current.id || match.away === current.id) || null;
    const euroMatch = getEuropeanMatchForWeek(state.week);
    if (euroMatch && state.european?.clubId === current.id) {
      return { type: "european", ...euroMatch };
    }
    if (leagueMatch) return { type: "league", ...leagueMatch };
    return null;
  }

  function nextOpponentLabel() {
    const match = getNextMatch();
    if (!match) return "本周无正式比赛";
    const isHome = match.home === currentClub().id;
    const opponent = club(isHome ? match.away : match.home);
    const prefix = match.type === "european" ? `${stateContainer.state.european?.competition || "欧战"}` : "联赛";
    return `${prefix} · ${isHome ? "主场" : "客场"} vs ${opponent.name}`;
  }

  function trainingGain(mode) {
    const player = stateContainer.state.player;
    const base = mode === "intense" ? randomInt(18, 28) : mode === "recovery" ? randomInt(5, 10) : randomInt(9, 17);
    const gain = Math.round(base * growthGainMultiplier(player));
    if (mode === "intense") {
      player.fatigue = clamp(player.fatigue + randomInt(6, 12), 0, 100);
      player.morale = clamp(player.morale + randomInt(0, 3), 0, 100);
    } else if (mode === "recovery") {
      player.fatigue = clamp(player.fatigue - randomInt(22, 36), 0, 100);
      player.morale = clamp(player.morale + randomInt(4, 8), 0, 100);
    } else {
      player.fatigue = clamp(player.fatigue + randomInt(0, 4), 0, 100);
      player.morale = clamp(player.morale + randomInt(0, 2), 0, 100);
    }
    player.xp += gain;
    maybeImprovePlayer();
    return gain;
  }

  function growthNeeded(player = stateContainer.state.player) {
    return 70 + player.overall * 3;
  }

  function growthGainMultiplier(player = stateContainer.state.player) {
    const potentialGap = Math.max(1, player.potential - player.overall);
    return clamp(potentialGap / 16, 0.45, 1.35);
  }

  function averageTrainingGain(mode, player = stateContainer.state.player) {
    const base = mode === "intense" ? 23 : mode === "recovery" ? 7.5 : 13;
    return Math.max(1, Math.round(base * growthGainMultiplier(player)));
  }

  function estimatedMatchGain(player = stateContainer.state.player) {
    const roleMinutes = {
      "主力": 72,
      "租借主力": 68,
      "轮换": 34,
      "租借轮换": 30,
      "梯队核心": 22,
      "未来计划": 18,
      "青训合同到期": 12
    };
    const minutes = roleMinutes[player.role] || 28;
    return Math.max(8, Math.round(14 + minutes * 0.42 + Math.max(0, player.form) * 0.9));
  }

  function growthInfo(player = stateContainer.state.player) {
    const needed = growthNeeded(player);
    const remaining = Math.max(0, needed - player.xp);
    const atCap = player.overall >= player.potential;
    const sessions = (gain) => (atCap ? null : Math.max(1, Math.ceil(remaining / Math.max(1, gain))));
    return {
      needed,
      current: Math.min(player.xp, needed),
      remaining,
      percent: atCap ? 100 : clamp((player.xp / needed) * 100, 0, 100),
      atCap,
      normalSessions: sessions(averageTrainingGain("normal", player)),
      intenseSessions: sessions(averageTrainingGain("intense", player)),
      matchSessions: sessions(estimatedMatchGain(player)),
      normalGain: averageTrainingGain("normal", player),
      intenseGain: averageTrainingGain("intense", player),
      matchGain: estimatedMatchGain(player)
    };
  }

  function growthProgressText(player = stateContainer.state.player) {
    const info = growthInfo(player);
    if (info.atCap) {
      return `当前已到潜力上限 ${player.potential}。成长经验会保留，赛季末突破潜力后才能继续转化为能力。`;
    }
    return `成长进度 ${info.current}/${info.needed}，还差 ${info.remaining} 点；预计常规训练 ${info.normalSessions} 次，强化训练 ${info.intenseSessions} 次，或有出场比赛约 ${info.matchSessions} 场触发下一次成长。`;
  }

  function trainingStatusNotice(player = stateContainer.state.player) {
    const fatigue = player.fatigue;
    const morale = player.morale;
    if (fatigue >= 90 && morale <= 30) {
      return {
        type: "danger",
        text: `疲劳 ${fatigue}/100 且士气 ${morale}/100：现在继续强化训练风险很高，下一场更可能替补或低评分，建议先恢复训练。`
      };
    }
    if (fatigue >= 90) {
      return {
        type: "danger",
        text: `疲劳 ${fatigue}/100：已经接近极限，强化训练会继续累积疲劳，建议优先恢复训练。`
      };
    }
    if (fatigue >= 75) {
      return {
        type: "warning",
        text: `疲劳 ${fatigue}/100：偏高，会降低出场概率和比赛评分，强化训练前最好考虑恢复。`
      };
    }
    if (morale <= 30) {
      return {
        type: "warning",
        text: `士气 ${morale}/100：偏低，比赛状态和舆论承压，稳定训练与好表现会更重要。`
      };
    }
    if (fatigue <= 45 && morale >= 65) {
      return {
        type: "positive",
        text: `疲劳 ${fatigue}/100，士气 ${morale}/100：状态不错，可以根据成长进度选择常规或强化训练。`
      };
    }
    return {
      type: "info",
      text: `当前疲劳 ${fatigue}/100，士气 ${morale}/100。强化训练成长更快，恢复训练能明显降低疲劳并稳定士气。`
    };
  }

  function train(mode) {
    const state = stateContainer.state;
    if (state.trainedThisWeek) {
      addLog("warning", "本周已经完成训练，教练组不允许你临时加练来堆能力。", "training");
      render();
      return;
    }
    if (mode === "intense" && (state.player.fatigue >= 85 || state.player.morale <= 25)) {
      const confirmed = window.confirm(`当前疲劳 ${state.player.fatigue}/100，士气 ${state.player.morale}/100。继续强化训练可能影响下一场出场和评分，仍要继续吗？`);
      if (!confirmed) {
        addLog("info", "你取消了强化训练，教练组建议根据状态选择常规训练或恢复训练。", "training");
        render();
        return;
      }
    }
    state.trainedThisWeek = true;
    const gain = trainingGain(mode);
    const labels = { normal: "常规训练", intense: "强化训练", recovery: "恢复训练" };
    addLog("positive", `${labels[mode]}完成，获得 ${gain} 点成长经验。${growthProgressText(state.player)}疲劳现在是 ${state.player.fatigue}/100。`, "training");
    saveGame(true);
    render();
  }

  function maybeImprovePlayer() {
    const player = stateContainer.state.player;
    let needed = growthNeeded(player);
    while (player.xp >= needed && player.overall < player.potential) {
      player.xp -= needed;
      const attributeKeys = growableAttributeKeys(player.position, player.attributes);
      if (!attributeKeys.length) break;
      const priority = attributePriority(player.position).filter((key) => attributeKeys.includes(key));
      const target = random() < 0.68 && priority.length ? choice(priority) : choice(attributeKeys);
      const oldAttribute = player.attributes[target];
      const oldOverall = player.overall;
      player.attributes[target] = clamp(player.attributes[target] + 1, 1, 99);
      player.overall = Math.min(player.potential, calculateOverall(player.attributes, player.position));
      needed = growthNeeded(player);
      player.value = calculateValue(player);
      player.wage = calculateWage(player, currentClub());
      const overallText = player.overall > oldOverall ? `综合能力 ${oldOverall} → ${player.overall}` : `综合能力暂时维持 ${player.overall}`;
      addLog("positive", `成长兑现：${attributeLabel(target)} +1（${oldAttribute} → ${player.attributes[target]}），${overallText}。`, "training");
    }
  }

  function attributePriorityLabels(positionId) {
    return attributePriority(positionId).map(attributeLabel).join("、");
  }

  function overallWeightLabels(positionId) {
    const weights = OVERALL_WEIGHTS[positionId] || OVERALL_WEIGHTS.CM;
    return Object.entries(weights)
      .sort((a, b) => b[1] - a[1])
      .map(([key, weight]) => `${attributeLabel(key)}${Math.round(weight * 100)}%`)
      .join("、");
  }

  function attributePriority(positionId) {
    return ATTRIBUTE_PRIORITIES[positionId] || ATTRIBUTE_PRIORITIES.CM;
  }

  function growableAttributeKeys(positionId, attributes) {
    const weights = OVERALL_WEIGHTS[positionId] || OVERALL_WEIGHTS.CM;
    return Object.keys(attributes).filter((key) => (weights[key] || 0) > 0 && attributes[key] < 99);
  }

  function growableAttributeLabels(positionId) {
    return growableAttributeKeys(positionId, stateContainer.state?.player?.attributes || {}).map(attributeLabel).join("、");
  }

  function attributeLabel(key) {
    return {
      pace: "速度",
      shooting: "射门",
      passing: "传球",
      dribbling: "盘带",
      defending: "防守",
      physical: "身体",
      goalkeeping: "门将"
    }[key];
  }

  function determineMinutes(match) {
    const state = stateContainer.state;
    const player = state.player;
    const own = currentClub();
    const opponent = club(match.home === own.id ? match.away : match.home);
    const academyPenalty = player.origin === "academy" ? 13 : 3;
    const roleBonus = player.role === "主力" ? 16 : player.role === "轮换" ? 6 : player.role === "梯队核心" ? -8 : player.role === "青训合同到期" ? -16 : -5;
    const trust = (state.attitudes.manager - 50) * 0.6;
    const freshness = (62 - player.fatigue) * 0.22;
    const score = player.overall - (own.rating - academyPenalty) + roleBonus + trust + freshness + player.form * 1.1 - (opponent.rating - own.rating) * 0.1;
    const startChance = clamp(35 + score * 3.6, 5, 92);
    const benchChance = clamp(58 + score * 2.7, 15, 98);
    const roll = random() * 100;
    if (roll < startChance) return randomInt(62, 90);
    if (roll < benchChance) return randomInt(12, 35);
    return 0;
  }

  function contributionFromPerformance(minutes, opponentRating, matchImportance) {
    const state = stateContainer.state;
    const player = state.player;
    if (minutes <= 0) {
      const benchTexts = [
        "你没有获得出场机会，只能在替补席旁完成热身。",
        "你下半场一度被叫去热身，但教练最终没有换人。",
        "镜头几次扫到你在替补席等待机会，终场前仍没能登场。",
        "你整场都在场边保持热身，赛后只能把情绪带回训练场。",
        "你没有被换上，但助教赛后提醒你下一周训练还会重新评估。"
      ];
      return {
        rating: 0,
        goals: 0,
        assists: 0,
        saves: 0,
        xp: randomInt(1, 3),
        text: choice(benchTexts)
      };
    }
    const line = positionLine(player.position);
    const minuteFactor = minutes / 90;
    const form = player.form * 0.14;
    const morale = (player.morale - 50) / 48;
    const fatigue = Math.max(0, player.fatigue - 50) / 42;
    const noise = (random() + random() + random() - 1.5) * 0.75;
    const rating = clamp(
      6.35 + form + morale - fatigue + minuteFactor * 0.42 + noise + matchImportance,
      5.2,
      9.8
    );
    let goals = 0;
    let assists = 0;
    let saves = 0;
    if (line === "goalkeeper") {
      saves = clamp(Math.round(randomInt(1, 6) + (player.attributes.goalkeeping - opponentRating) / 8 + randomInt(-1, 2)), 0, 10);
    } else {
      const attackSkill = line === "attacker" ? player.attributes.shooting : line === "midfielder" ? player.attributes.passing : player.attributes.defending;
      const goalChance = clamp((attackSkill - 48) * minuteFactor * (line === "attacker" ? 1.35 : line === "midfielder" ? 0.55 : 0.22), 2, 58);
      if (random() * 100 < goalChance + (rating - 7) * 9) goals += 1;
      if (random() * 100 < (goalChance - 16) * 0.45) goals += 1;
      const assistChance = clamp((player.attributes.passing + player.attributes.dribbling - 96) * minuteFactor * (line === "defender" ? 0.24 : 0.62), 2, 54);
      if (random() * 100 < assistChance + (rating - 7) * 8) assists += 1;
    }
    return { rating, goals, assists, saves, minutes };
  }

  function buildContributionText(minutes, rating, goals, assists, saves) {
    let text = `你出场 ${minutes} 分钟，评分 ${rating.toFixed(1)}`;
    if (goals || assists) text += `，贡献 ${goals} 球 ${assists} 助攻`;
    if (saves) text += `，完成 ${saves} 次扑救`;
    return `${text}。`;
  }

  function finalizeMatchContribution(contribution, { won, drawn, ownGoals, oppGoals, isGoalkeeper }) {
    if (contribution.rating === 0) {
      return {
        ...contribution,
        xp: randomInt(1, 3),
        text: contribution.text || "你没有获得出场机会。"
      };
    }

    const { minutes, goals, assists, saves } = contribution;
    const minuteFactor = minutes / 90;
    const margin = ownGoals - oppGoals;
    const bigWin = won && margin >= 3;
    const bigLoss = !won && !drawn && margin <= -3;
    const heavyLoss = !won && !drawn && margin <= -2;
    let rating = contribution.rating;

    rating += won ? 0.7 : drawn ? 0.22 : bigLoss ? -1.15 : heavyLoss ? -0.75 : -0.35;
    rating += goals * 0.88;
    rating += assists * 0.42;
    rating += minuteFactor * 0.38;
    if (bigWin) rating += 0.9;
    else if (won && margin >= 2) rating += 0.45;
    if (won && goals + assists > 0) rating += 0.3;
    if (drawn && goals > 0) rating += 0.22;
    if (!won && goals > 0 && goals >= ownGoals) rating += 0.75;
    if (isGoalkeeper && oppGoals === 0) rating += 0.6;

    if (won && (goals || assists) && minutes >= 45) {
      rating = Math.max(rating, bigWin ? 7.2 : margin >= 2 ? 7.0 : 6.8);
    } else if (won && minutes >= 45) {
      const winFloor = bigWin && minutes >= 60 ? 6.8 : bigWin ? 6.5 : margin >= 2 ? 6.3 : 6.1;
      rating = Math.max(rating, winFloor);
    } else if (drawn && minutes >= 60 && (goals || assists)) {
      rating = Math.max(rating, 6.3);
    } else if (!won && goals > 0 && goals >= ownGoals) {
      rating = Math.max(rating, 6.5);
    } else if (minutes >= 75 && (won || drawn || goals || assists)) {
      rating = Math.max(rating, 5.8);
    }

    if (!won && !drawn && !goals && !assists) {
      if (bigLoss) rating = Math.min(rating, 6.2);
      else if (heavyLoss) rating = Math.min(rating, 6.6);
      else rating = Math.min(rating, 7.0);
    }

    rating = clamp(rating, 5.0, 9.8);

    let xp = Math.round(14 + minutes * 0.42 + Math.max(0, rating - 6) * 11 + goals * 24 + assists * 16 + saves * 5);
    if (won) xp += 15;
    else if (drawn) xp += 6;
    else if (goals || assists) xp += 10;

    const text = buildContributionText(minutes, rating, goals, assists, saves);
    const performanceTier = classifyPerformanceTier({ won, drawn, margin, rating, goals, assists, minutes });
    return {
      ...contribution,
      rating,
      xp,
      text,
      matchWon: won,
      matchDrawn: drawn,
      matchMargin: margin,
      hadContribution: goals > 0 || assists > 0,
      performanceTier
    };
  }

  function classifyPerformanceTier({ won, drawn, margin, rating, goals, assists, minutes }) {
    const hadContribution = goals > 0 || assists > 0;
    if (minutes <= 0) return "bench";
    if (won) {
      if (hadContribution || rating >= 7.4) return "standout";
      if (rating >= 6.2) return "routine";
      return "struggle";
    }
    if (drawn) {
      if (hadContribution || rating >= 7.0) return "standout";
      return "routine";
    }
    if (hadContribution || rating >= 7.2) return "standout";
    if (margin <= -3) return "heavy";
    if (margin <= -2) return "heavy";
    if (rating <= 5.8 && !hadContribution) return "struggle";
    return "routine";
  }

  function getMatchMediaContext(contribution, won, drawn, ownGoals, oppGoals) {
    const margin = contribution.matchMargin ?? ownGoals - oppGoals;
    const hadContribution = contribution.hadContribution ?? (contribution.goals > 0 || contribution.assists > 0);
    const rating = contribution.rating || 0;
    const tier = contribution.performanceTier || classifyPerformanceTier({
      won,
      drawn,
      margin,
      rating,
      goals: contribution.goals,
      assists: contribution.assists,
      minutes: contribution.minutes
    });
    return {
      margin,
      hadContribution,
      rating,
      tier,
      won,
      drawn,
      bigWin: won && margin >= 3,
      bigLoss: !won && !drawn && margin <= -3,
      heavyLoss: !won && !drawn && margin <= -2
    };
  }

  function setMediaEvent(event) {
    stateContainer.state.pendingChoice = {
      kind: "media",
      title: event.title,
      prompt: event.prompt,
      choices: event.choices
    };
  }

  function simulateUserMatch(match, detailed) {
    const state = stateContainer.state;
    const player = state.player;
    const own = currentClub();
    const isHome = match.home === own.id;
    const opponent = club(isHome ? match.away : match.home);
    const minutes = determineMinutes(match);
    const importance = getMatchImportance();
    const contribution = contributionFromPerformance(minutes, opponent.rating, importance);
    const playerBoost = minutes > 0 ? (contribution.rating - 6.4) * 1.15 + contribution.goals * 0.75 + contribution.assists * 0.38 : -0.35;
    let score = simulateScore(match.home, match.away, isHome ? playerBoost : -playerBoost * 0.65);
    if (isHome) {
      score.homeGoals += contribution.goals;
      score.homeGoals += Math.min(contribution.assists, random() < 0.72 ? contribution.assists : 0);
    } else {
      score.awayGoals += contribution.goals;
      score.awayGoals += Math.min(contribution.assists, random() < 0.72 ? contribution.assists : 0);
    }
    if (positionLine(player.position) === "goalkeeper" && minutes > 0 && contribution.rating > 7.2 && random() < 0.42) {
      if (isHome) score.awayGoals = Math.max(0, score.awayGoals - 1);
      else score.homeGoals = Math.max(0, score.homeGoals - 1);
    }
    const ownGoals = isHome ? score.homeGoals : score.awayGoals;
    const oppGoals = isHome ? score.awayGoals : score.homeGoals;
    const won = ownGoals > oppGoals;
    const drawn = ownGoals === oppGoals;
    const resultText = `${own.name} ${ownGoals}-${oppGoals} ${opponent.name}`;
    Object.assign(
      contribution,
      finalizeMatchContribution(contribution, {
        won,
        drawn,
        ownGoals,
        oppGoals,
        isGoalkeeper: positionLine(player.position) === "goalkeeper"
      })
    );
    player.season.appearances += minutes > 0 ? 1 : 0;
    player.season.goals += contribution.goals;
    player.season.assists += contribution.assists;
    player.season.cleanSheets += positionLine(player.position) === "goalkeeper" && minutes > 0 && oppGoals === 0 ? 1 : 0;
    if (minutes > 0) {
      player.season.ratingTotal += contribution.rating;
      player.season.ratedMatches += 1;
      player.form = clamp(player.form + (contribution.rating - 6.6) * 0.55 + (won ? 0.8 : drawn ? 0.1 : -0.8), -8, 8);
      const resultMorale = won ? 4 : drawn ? 1 : -3;
      const ratingMorale = contribution.rating > 7.4 ? 4 : contribution.rating < 5.8 ? -2 : contribution.rating < 6.2 ? -1 : 0;
      player.morale = clamp(player.morale + resultMorale + ratingMorale, 0, 100);
      state.attitudes.manager = clamp(state.attitudes.manager + (contribution.rating - 6.5) * 1.6 + (won ? 1 : drawn ? 0 : -1), 0, 100);
      state.attitudes.fans = clamp(state.attitudes.fans + contribution.goals * 2.4 + contribution.assists * 1.6 + (won ? 1.2 : drawn ? 0 : -1.6), 0, 100);
      state.attitudes.teammates = clamp(state.attitudes.teammates + (contribution.rating - 6.5) * 0.9 + (contribution.assists ? 1.4 : 0), 0, 100);
    } else {
      player.form = clamp(player.form - 0.35, -8, 8);
      player.morale = clamp(player.morale - 1, 0, 100);
      state.attitudes.manager = clamp(state.attitudes.manager - 0.5, 0, 100);
    }
    player.fatigue = clamp(player.fatigue + Math.round(minutes * 0.2) + randomInt(1, 5), 0, 100);
    player.xp += contribution.xp;
    maybeImprovePlayer();
    player.value = calculateValue(player);
    player.wage = calculateWage(player, own);

    updateTable(own.league, match.home, match.away, score.homeGoals, score.awayGoals);
    const logType = won ? "positive" : drawn ? "info" : "negative";
    const summary = `${resultText}。${contribution.text}成长经验 +${contribution.xp}。${growthProgressText(player)}`;
    addLog(logType, summary, "match");
    if (detailed) {
      const commentary = buildCommentary(own, opponent, ownGoals, oppGoals, contribution, isHome, won, drawn);
      commentary.reverse().forEach((line) => addLog("info", line, "match"));
    }
    maybeCreateMediaEvent(contribution, won, drawn, resultText, ownGoals, oppGoals);
  }

  function buildCommentary(own, opponent, ownGoals, oppGoals, contribution, isHome, won, drawn) {
    const lines = [];
    lines.push(`赛前：${own.name}${isHome ? "坐镇主场迎战" : "客场挑战"}${opponent.name}，教练组强调纪律和转换速度。`);
    lines.push(`第 ${randomInt(8, 22)} 分钟：${opponent.name}率先压上，${own.name}后场顶住第一波冲击。`);
    if (contribution.rating > 0) {
      lines.push(`第 ${randomInt(24, 38)} 分钟：你第一次进入比赛镜头，处理球很冷静，评分开始上升。`);
    }
    if (contribution.goals > 0) {
      lines.push(`第 ${randomInt(39, 72)} 分钟：你抓住机会破门，替补席全体起身庆祝。`);
    }
    if (contribution.assists > 0) {
      lines.push(`第 ${randomInt(55, 81)} 分钟：你送出关键传球，队友完成终结。`);
    }
    if (contribution.saves > 2) {
      lines.push(`第 ${randomInt(61, 86)} 分钟：你连续做出扑救，把比赛悬念留到最后。`);
    }
    lines.push(`终场：${own.name} ${ownGoals}-${oppGoals} ${opponent.name}，${won ? "球队拿到关键三分" : drawn ? "双方各取一分" : "球队没能守住局面"}。`);
    return lines;
  }

  function getMatchImportance() {
    const state = stateContainer.state;
    const league = currentClub().league;
    const rows = sortedTable(league);
    const rank = rows.findIndex((row) => row.teamId === currentClub().id) + 1;
    if (state.week < 5) return 0;
    if (rank <= 4 || rank >= rows.length - 3) return 0.15;
    return 0;
  }

  function simulateNeutralMatch(leagueId, match) {
    const score = simulateScore(match.home, match.away, 0);
    updateTable(leagueId, match.home, match.away, score.homeGoals, score.awayGoals);
  }

  function buildWinStandoutPersonalMediaEvents(contribution, resultText, own) {
    return [
      {
        title: "高光胜利",
        prompt: `记者问：“${resultText}，你这场个人发挥很抢眼，怎么评价自己的状态？”`,
        choices: [
          { label: "赢球最重要，但个人状态确实不错。", effects: { manager: 3, fans: 2, teammates: 2, morale: 3 }, tone: "positive" },
          { label: "我还需要把这样的表现稳定下来。", effects: { manager: 3, fans: 1, teammates: 2, morale: 2 }, tone: "positive" },
          { label: "我会继续用训练把状态留住。", effects: { manager: 2, fans: 2, morale: 2 }, tone: "info" }
        ]
      },
      ...buildWinContributionMediaEvents(contribution, resultText, own)
    ];
  }

  function buildWinRoutineMediaEvents(resultText, own) {
    return [
      {
        title: "赛后胜利采访",
        prompt: `记者问：“${resultText}，球队拿到了三分，但过程并不轻松。你怎么看？”`,
        choices: [
          { label: "三分最重要，全队还需要更稳定。", effects: { manager: 3, fans: 1, teammates: 2, morale: 2 }, tone: "positive" },
          { label: "赢球让人开心，但我个人还有提升空间。", effects: { manager: 2, fans: 1, morale: 2 }, tone: "positive" },
          { label: "我会把胜利当作动力，继续争取更多时间。", effects: { manager: 2, fans: 2, agent: 1, morale: 2 }, tone: "info" }
        ]
      },
      {
        title: "混采区",
        prompt: `记者问：“${resultText} 后，你觉得自己这场贡献足够吗？”`,
        choices: [
          { label: "我完成了任务，但还能做得更好。", effects: { manager: 2, fans: 1, teammates: 1, morale: 1 }, tone: "info" },
          { label: "团队赢球，我的表现只是中规中矩。", effects: { manager: 2, fans: 1, teammates: 2, morale: 1 }, tone: "positive" },
          { label: "我需要更多决定性表现来证明自己。", effects: { manager: -1, fans: 2, agent: 1, morale: 2 }, tone: "info" }
        ]
      }
    ];
  }

  function buildWinStruggleMediaEvents(resultText, own) {
    return [
      {
        title: "赢球反思",
        prompt: `记者问：“${resultText}，球队赢了，但你这场发挥似乎不在最佳状态。你怎么看？”`,
        choices: [
          { label: "赢球能掩盖问题，但我不会找借口。", effects: { manager: 3, fans: 1, teammates: 2, morale: 1 }, tone: "positive" },
          { label: "我会回看录像，下一场要更稳定。", effects: { manager: 3, fans: 0, teammates: 2, morale: 1 }, tone: "info" },
          { label: "结果满意，但个人表现确实不够好。", effects: { manager: 2, fans: 1, morale: 0 }, tone: "info" }
        ]
      }
    ];
  }

  function buildLossStandoutMediaEvents(contribution, resultText, own) {
    const statLine = contribution.goals
      ? `打入 ${contribution.goals} 球`
      : contribution.assists
        ? `送出 ${contribution.assists} 次助攻`
        : "个人表现不错";
    return [
      {
        title: "虽败犹荣",
        prompt: `记者问：“${resultText}，球队输了，但你${statLine}。你怎么评价自己的表现？”`,
        choices: [
          { label: "结果不满意，但至少我完成了该做的。", effects: { manager: 2, fans: 2, teammates: 2, morale: 2 }, tone: "positive" },
          { label: "个人表现不能代替团队胜利，我会继续拼。", effects: { manager: 3, fans: 1, teammates: 3, morale: 1 }, tone: "positive" },
          { label: "这样的比赛让我更想证明自己能带队赢球。", effects: { manager: 1, fans: 2, agent: 2, morale: 2 }, tone: "info" }
        ]
      },
      {
        title: "赛后通道",
        prompt: `混采区记者问：“${resultText} 后，不少评论认为你是球队少数亮点，你怎么看？”`,
        choices: [
          { label: "感谢认可，但我更想要胜利。", effects: { manager: 2, fans: 2, teammates: 1, morale: 2 }, tone: "positive" },
          { label: "亮点不够，我还需要更稳定。", effects: { manager: 3, fans: 1, teammates: 2, morale: 1 }, tone: "info" },
          { label: "我会把这样的表现延续到下一场。", effects: { manager: 2, fans: 2, morale: 2 }, tone: "positive" }
        ]
      }
    ];
  }

  function buildHeavyLossMediaEvents(resultText, own) {
    return [
      {
        title: "惨败采访",
        prompt: `赛后采访区气氛沉重，记者问：“${resultText}，这场失利对你和球队意味着什么？”`,
        choices: [
          { label: "这是教训，我们必须尽快回应。", effects: { manager: 3, fans: 1, teammates: 2, morale: 1 }, tone: "positive" },
          { label: "比分很难看，但赛季还没结束。", effects: { manager: 2, fans: 0, teammates: 1, morale: 0 }, tone: "info" },
          { label: "这样的比赛会伤害信心，但只能向前看。", effects: { manager: 1, fans: -1, teammates: 1, morale: -1 }, tone: "warning" }
        ]
      },
      {
        title: "更衣室气氛",
        prompt: `记者问：“${resultText} 后，更衣室气氛如何？你会怎么调整？”`,
        choices: [
          { label: "没人能接受这样的比分，训练里要找回强度。", effects: { manager: 3, teammates: 2, morale: 1 }, tone: "positive" },
          { label: "先恢复，再把注意力放到下一场。", effects: { manager: 2, teammates: 1, morale: 1, fatigue: -3 }, tone: "info" },
          { label: "我需要更多上场时间来改变局面。", effects: { manager: -1, fans: 1, agent: 2, morale: 1 }, tone: "warning" }
        ]
      }
    ];
  }

  function buildLossRoutineMediaEvents(resultText, own, struggle) {
    return [
      {
        title: struggle ? "失利反思" : "赛后采访",
        prompt: struggle
          ? `记者问：“${resultText}，你这场发挥也不理想。问题出在哪里？”`
          : `记者问：“${resultText} 之后，你怎么评价球队和个人的表现？”`,
        choices: [
          { label: "结果和表现都要提升，我会先看录像。", effects: { manager: 3, fans: 1, teammates: 2, morale: 1 }, tone: "positive" },
          { label: "团队输球，我个人也需要更稳定。", effects: { manager: 2, fans: 0, teammates: 1, morale: 0 }, tone: "info" },
          { label: "这样的比赛很打击士气，但只能继续拼。", effects: { manager: 1, fans: -1, teammates: 1, morale: -1 }, tone: "warning" }
        ]
      },
      {
        title: "战术讨论",
        prompt: `专栏记者问：“${resultText} 后，你觉得问题主要在个人还是整体？”`,
        choices: [
          { label: "整体防守和转换都有问题，我先做好自己。", effects: { manager: 2, fans: 1, teammates: 2, morale: 1 }, tone: "info" },
          { label: "我还需要更好地适应比赛节奏。", effects: { manager: 2, fans: 0, teammates: 1, morale: 1, fatigue: -3 }, tone: "info" },
          { label: "我希望以后能在更合适的角色里踢球。", effects: { manager: -2, board: -1, fans: 1, agent: 2, morale: 1 }, tone: "warning" }
        ]
      }
    ];
  }

  function buildDrawMediaEvents(resultText, own, standout) {
    return [
      {
        title: standout ? "平局亮点" : "平局采访",
        prompt: standout
          ? `记者问：“${resultText}，虽然只拿一分，但你有不错发挥。怎么看？”`
          : `记者问：“${resultText}，各取一分后，你怎么评价这场比赛？”`,
        choices: [
          { label: "一分可以接受，但我们本可以做得更好。", effects: { manager: 2, fans: 1, teammates: 1, morale: 1 }, tone: "info" },
          { label: "我会把个人状态延续到下一场。", effects: { manager: 2, fans: 1, morale: 2 }, tone: "positive" },
          { label: "平局不够，我们要争取更多胜利。", effects: { manager: 2, fans: 2, teammates: 1, morale: 1 }, tone: "positive" }
        ]
      }
    ];
  }

  function buildWinContributionMediaEvents(contribution, resultText, own) {
    return [
      {
        title: "胜利功臣",
        prompt: `记者问：“${resultText}，你${contribution.goals ? `打入 ${contribution.goals} 球` : ""}${contribution.goals && contribution.assists ? "并" : ""}${contribution.assists ? `送出 ${contribution.assists} 次助攻` : ""}，怎么评价自己的表现？”`,
        choices: [
          { label: "帮助球队赢球最重要，个人数据是副产品。", effects: { manager: 3, fans: 2, teammates: 3, morale: 3 }, tone: "positive" },
          { label: "我还需要更稳定，今天只是做到了该做的。", effects: { manager: 3, fans: 1, teammates: 2, morale: 2 }, tone: "positive" },
          { label: "关键进球/助攻当然开心，我会把状态延续下去。", effects: { manager: 2, fans: 3, teammates: 2, morale: 3 }, tone: "positive" }
        ]
      },
      {
        title: "赛后通道",
        prompt: `混采区记者问：“${resultText} 后更衣室气氛很好，你的${contribution.goals ? "进球" : "助攻"}是转折点吗？”`,
        choices: [
          { label: "全队都在拼，我只是完成了该完成的工作。", effects: { manager: 3, fans: 2, teammates: 3, morale: 2 }, tone: "positive" },
          { label: "关键球需要冷静，今天做到了。", effects: { manager: 2, fans: 3, teammates: 1, morale: 3 }, tone: "positive" },
          { label: "我会把这种感觉带到下一场比赛。", effects: { manager: 2, fans: 2, morale: 2 }, tone: "positive" }
        ]
      }
    ];
  }

  function buildWinMediaEvents(contribution, resultText, own, margin) {
    const events = [
      {
        title: "赛后胜利采访",
        prompt: `记者问：“${resultText}，作为获胜的一方，你怎么评价今天全队表现？”`,
        choices: [
          { label: "三分最重要，全队执行了比赛计划。", effects: { manager: 3, fans: 2, teammates: 2, morale: 2 }, tone: "positive" },
          { label: "赢球让人开心，但我个人还有提升空间。", effects: { manager: 2, fans: 1, morale: 2 }, tone: "positive" },
          { label: "我会把胜利当作动力，继续争取更多时间。", effects: { manager: 2, fans: 2, agent: 1, morale: 2 }, tone: "info" }
        ]
      }
    ];
    if (margin >= 3) {
      events.unshift({
        title: "大胜庆功",
        prompt: `记者笑着问：“${resultText}，全队士气正高，你怎么评价今天这场胜利？”`,
        choices: [
          { label: "这是全队努力的结果，我们要保持这种强度。", effects: { manager: 3, fans: 2, teammates: 3, morale: 3 }, tone: "positive" },
          { label: "大胜让人兴奋，但赛季还长，不能松懈。", effects: { manager: 4, board: 1, fans: 1, teammates: 2, morale: 2 }, tone: "positive" },
          { label: "我们会把胜利当作新的起点。", effects: { manager: 2, fans: 2, teammates: 2, morale: 2 }, tone: "positive" }
        ]
      });
    }
    return events;
  }

  function maybeCreateMediaEvent(contribution, won, drawn, resultText, ownGoals = 0, oppGoals = 0, forceMedia = false) {
    const state = stateContainer.state;
    const own = currentClub();
    if (state.pendingChoice) return;

    const ctx = getMatchMediaContext(contribution, won, drawn, ownGoals, oppGoals);
    const marketNoise = state.market.isOpen || !["stay", "minutes"].includes(state.market.strategy);
    const triggerChance = ctx.tier === "bench" || marketNoise ? 0.34 : 0.18;
    const trigger = forceMedia || ctx.tier !== "routine" || marketNoise || random() < triggerChance;
    if (!trigger) {
      createSocialPulse(contribution, won, drawn, resultText, ownGoals, oppGoals);
      return;
    }

    if (ctx.tier === "bench") {
      const benchPool = ctx.won
        ? [
            {
              title: "胜利替补席",
              prompt: `球队${resultText}赢球，但你没有获得出场。记者问：“你怎么看待这场胜利和自己的角色？”`,
              choices: [
                { label: "为队友高兴，我会继续训练等待机会。", effects: { manager: 3, fans: 1, teammates: 2, morale: 1 }, tone: "positive" },
                { label: "胜利属于全队，但我确实需要比赛时间。", effects: { manager: -1, fans: 1, agent: 2, morale: 2 }, tone: "info" },
                { label: "赢球让我更想尽快回到场上。", effects: { manager: 2, fans: 2, teammates: 1, morale: 2 }, tone: "positive" }
              ]
            }
          ]
        : [
            {
              title: "替补席话题",
              prompt: `社交媒体上有人质疑你出场时间太少，记者问：“如果继续没机会，你会考虑外租或离队吗？”`,
              choices: [
                { label: `我尊重${own.name}的安排，但球员需要比赛。`, effects: { manager: -1, board: 0, fans: 1, agent: 3, morale: 2 }, tone: "warning" },
                { label: "我会先把训练做好，机会来了必须抓住。", effects: { manager: 3, fans: 1, teammates: 1, morale: 1 }, tone: "positive" },
                { label: "这些事情会交给经纪人评估。", effects: { manager: -2, board: -1, fans: 2, agent: 3, morale: 1 }, tone: "warning" }
              ]
            }
          ];
      setMediaEvent(choice(benchPool));
      return;
    }

    if (ctx.won) {
      if (ctx.tier === "standout" && ctx.hadContribution) {
        setMediaEvent(choice(buildWinContributionMediaEvents(contribution, resultText, own)));
        return;
      }
      if (ctx.tier === "standout") {
        setMediaEvent(choice(buildWinStandoutPersonalMediaEvents(contribution, resultText, own)));
        return;
      }
      if (ctx.bigWin) {
        setMediaEvent(choice(buildWinMediaEvents(contribution, resultText, own, ctx.margin)));
        return;
      }
      if (ctx.tier === "routine") {
        setMediaEvent(choice(buildWinRoutineMediaEvents(resultText, own)));
        return;
      }
      if (ctx.tier === "struggle") {
        setMediaEvent(choice(buildWinStruggleMediaEvents(resultText, own)));
        return;
      }
      setMediaEvent(choice(buildWinRoutineMediaEvents(resultText, own)));
      return;
    }

    if (ctx.drawn) {
      setMediaEvent(choice(buildDrawMediaEvents(resultText, own, ctx.tier === "standout")));
      return;
    }

    if (ctx.tier === "standout") {
      setMediaEvent(choice(buildLossStandoutMediaEvents(contribution, resultText, own)));
      return;
    }
    if (ctx.bigLoss || ctx.heavyLoss) {
      setMediaEvent(choice(buildHeavyLossMediaEvents(resultText, own)));
      return;
    }
    setMediaEvent(choice(buildLossRoutineMediaEvents(resultText, own, ctx.tier === "struggle")));
  }

  function createSocialPulse(contribution, won, drawn, resultText, ownGoals = 0, oppGoals = 0) {
    const state = stateContainer.state;
    const player = state.player;
    const own = currentClub();
    const pulses = [];
    const lead = `社交媒体热度：${resultText} 后，`;
    const margin = ownGoals - oppGoals;
    const bigWin = won && margin >= 3;

    if (bigWin) {
      pulses.push(
        { tone: "positive", text: `${lead}球迷刷屏庆祝，认为球队打出了赛季最完整的一场比赛。` },
        { tone: "positive", text: `${lead}当地媒体标题清一色是“大胜”，更衣室士气成为热议话题。` },
        { tone: "info", text: `${lead}评论员提醒球队别被一场大胜冲昏头脑，但总体评价非常积极。` }
      );
    } else if (contribution.rating === 0) {
      if (won) {
        pulses.push(
          { tone: "positive", text: `${lead}球迷沉浸在胜利喜悦中，也有人在讨论替补轮换是否该给你机会。` },
          { tone: "info", text: `${lead}当地记者说球队深度不错，但年轻球员仍需要比赛来成长。` },
          { tone: "info", text: `${lead}社媒上有人剪辑全队庆祝画面，你的名字出现在“下一个该上场的人”讨论里。` }
        );
      } else {
        pulses.push(
          { tone: "info", text: `${lead}球迷把镜头扫到你热身的片段剪出来，讨论你是否该得到更多机会。` },
          { tone: "info", text: `${lead}当地记者提到你连续等待机会，认为接下来几周的训练态度会很关键。` },
          { tone: "warning", text: `${lead}评论区有人建议你考虑外租，也有人认为年轻球员应该继续耐心等待。` },
          { tone: "info", text: `${lead}球迷论坛开帖分析${positionName(player.position)}轮换顺位，你的名字被反复提到。` }
        );
      }
    } else if (won && contribution.rating >= 7.4) {
      pulses.push(
        { tone: "info", text: `${lead}不少球迷开始剪辑你的高光片段，称你踢得越来越像一线队球员。` },
        { tone: "positive", text: `${lead}数据博主晒出你的评分和关键贡献，认为你应该得到更稳定的比赛时间。` },
        { tone: "info", text: `${lead}转播嘉宾夸你在关键区域处理球冷静，社媒关注度明显上涨。` }
      );
    } else if (contribution.rating <= 5.9 && !contribution.goals && !contribution.assists && !won) {
      pulses.push(
        { tone: "warning", text: `${lead}评论区对你的发挥有些不耐烦，尤其在几次丢失球权后批评声变多。` },
        { tone: "warning", text: `${lead}球迷电台讨论你是否被放在了不舒服的位置，但也提醒年轻球员必须更稳定。` },
        { tone: "warning", text: `${lead}赛后评分榜把你列在低位，经纪人建议你别被短期舆论带节奏。` }
      );
    } else if (!won && (contribution.goals || contribution.assists)) {
      pulses.push(
        { tone: "positive", text: `${lead}尽管输球，不少球迷仍认可你的${contribution.goals ? "进球" : "助攻"}贡献，认为你值得更多首发机会。` },
        { tone: "info", text: `${lead}评论员说球队整体低迷，但你的关键表现是少数亮点。` },
        { tone: "info", text: `${lead}社媒上有球迷剪辑你的个人集锦，讨论你是否被战术角色限制。` }
      );
    } else {
      pulses.push(
        { tone: won ? "positive" : "info", text: `${lead}${won ? "舆论整体轻松，认为你踢得很成熟。" : drawn ? "评论比较中性，大家更关心球队排名。" : "舆论有些低沉，但还没有集中到你身上。"}` },
        { tone: "info", text: `${lead}${won ? "球迷更关注球队大胜，你的表现被评价为稳定可靠。" : "球迷更关注球队结果，你的表现被评价为中规中矩。"}` },
        { tone: "info", text: `${lead}本地媒体给你的关键词是“${won ? "团队贡献" : "稳定"}”和“${won ? "值得更多机会" : "还需要更多存在感"}”。` }
      );
    }

    if (state.market.isOpen && !won) {
      pulses.push(
        { tone: "info", text: `转会窗流言：有记者称经纪人${state.agent.name}仍在接触潜在下家，但正式报价才算数。` },
        { tone: "warning", text: `网络评论开始猜测你是否会在窗口关闭前改变计划，${own.name}球迷希望你先专注比赛。` }
      );
    }

    if (state.market.strategy === "loan" && !won) {
      pulses.push({ tone: "info", text: `外租话题升温：球迷争论你是该留队等机会，还是去一支能承诺时间的球队练级。` });
    } else if ((state.market.strategy === "transfer" || state.market.strategy === "bigger") && !won) {
      pulses.push({ tone: "warning", text: `转会话题升温：部分球迷担心你已经在考虑下一站，也有人觉得年轻球员需要更高舞台。` });
    }

    const pulse = choice(pulses);
    addLog(pulse.tone, pulse.text, "media");
  }

  function createInitialAcademyNegotiation() {
    const state = stateContainer.state;
    const player = state.player;
    if (player.origin !== "academy") return;

    const motherClub = currentClub();
    const promotionScore = player.overall + (player.potential - 84) * 0.55 + state.attitudes.manager * 0.12 - (motherClub.rating - 84) * 0.45;
    const promotionAvailable = promotionScore + randomInt(-4, 8) >= 68;
    const choices = [];

    if (promotionAvailable) {
      const role = player.overall >= motherClub.rating - 15 ? "轮换" : "未来计划";
      const firstTeamWage = Math.round(calculateWage(player, motherClub) * 0.62);
      choices.push({
        label: `接受${motherClub.name}一线队职业合同：${role}，3 年，${wage(firstTeamWage)}`,
        tag: "agent",
        tone: "positive",
        effects: { manager: 5, board: 3, fans: 2, morale: 5 },
        outcome: {
          type: "academyContract",
          clubId: motherClub.id,
          status: "firstTeam",
          role,
          years: 3,
          wage: firstTeamWage,
          log: `${motherClub.name}决定把你升入一线队名单。你签下 3 年职业合同，定位是${role}。`
        }
      });
    }

    choices.push({
      label: `接受${motherClub.name}梯队续约：梯队核心，2 年，承诺定期随一线队训练`,
      tag: "agent",
      tone: "info",
      effects: { manager: 2, board: 4, fans: 0, morale: 1 },
      outcome: {
        type: "academyContract",
        clubId: motherClub.id,
        status: "academy",
        role: "梯队核心",
        years: 2,
        wage: Math.max(1400, Math.round(calculateWage(player, motherClub) * 0.18)),
        log: `${motherClub.name}给出梯队续约方案：你会作为梯队核心培养，并定期参加一线队合练。`
      }
    });

    eliteAcademyClubs()
      .filter((candidate) => candidate.id !== motherClub.id)
      .map((candidate) => ({
        candidate,
        score: candidate.reputation + randomInt(-8, 10) + (player.potential - 88) * 1.2
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, randomInt(1, 3))
      .forEach(({ candidate }) => {
        const academyWage = Math.max(1800, Math.round(calculateWage(player, candidate) * (0.2 + random() * 0.08)));
        choices.push({
          label: `听取${candidate.name}梯队挖角：梯队核心，${random() < 0.45 ? "更快一线队通道" : "重点培养计划"}，${wage(academyWage)}`,
          tag: "agent",
          tone: "warning",
          effects: { manager: -3, board: -2, fans: -1, agent: 2, morale: 3 },
          outcome: {
            type: "academyContract",
            clubId: candidate.id,
            status: "academy",
            role: "梯队核心",
            years: randomInt(2, 3),
            wage: academyWage,
            log: `${candidate.name}梯队完成挖角谈判。你离开${motherClub.name}青训体系，签下梯队职业培养合同。`
          }
        });
      });

    state.pendingChoice = {
      kind: "academyContract",
      title: "青训合约即将到期",
      prompt: `经纪人${state.agent.name}告诉你：${motherClub.name}的青训合约只剩最后一年。母队正在决定是否让你进一线队，其他豪门梯队也在试探挖角。你必须先决定下一份合同方向。`,
      choices
    };
  }

  function applyChoiceOutcome(choiceItem) {
    const outcome = choiceItem.outcome;
    if (!outcome || outcome.type !== "academyContract") return;

    const state = stateContainer.state;
    const player = state.player;
    const oldClub = currentClub();
    const target = club(outcome.clubId);

    player.clubId = target.id;
    player.contractYears = outcome.years;
    player.role = outcome.role;
    player.wage = outcome.wage;
    player.academyStatus = outcome.status;
    player.value = calculateValue(player);
    player.reputation = clamp(player.reputation + (target.reputation - oldClub.reputation) * 0.05 + (outcome.status === "firstTeam" ? 3 : 1), 0, 100);

    state.attitudes.manager = outcome.status === "firstTeam" ? 58 : 49;
    state.attitudes.board = outcome.status === "firstTeam" ? 58 : 55;
    state.attitudes.fans = clamp(target.id === oldClub.id ? state.attitudes.fans + 1 : 44 + player.reputation * 0.22, 0, 100);
    state.attitudes.teammates = outcome.status === "firstTeam" ? 52 : 48;

    ensureLeagueSeason(target.league);
    if (target.id !== oldClub.id) {
      catchUpLeague(target.league, state.week);
      trackClubMove({
        type: outcome.status === "academy" ? "join" : "transfer",
        fromClubId: oldClub.id,
        toClubId: target.id,
        fee: outcome.wage || 0,
        feeLabel: outcome.status === "academy" ? "梯队合同" : "一线队提拔"
      });
    }
    addLog(choiceItem.tone || "info", outcome.log, choiceItem.tag || "agent");
  }

  function answerChoice(index) {
    const state = stateContainer.state;
    const choiceItem = state.pendingChoice?.choices[index];
    if (!choiceItem) return;
    const choiceKind = state.pendingChoice.kind;
    applyChoiceOutcome(choiceItem);
    applyEffects(choiceItem.effects);
    if (!choiceItem.outcome) {
      const prefix = choiceKind === "media" ? "你的回应" : "你的选择";
      const impact = formatChoiceEffects(choiceItem.effects);
      addLog(choiceItem.tone || "info", `${prefix}：“${choiceItem.label}”${impact}。`, choiceItem.tag || "media");
    }
    state.pendingChoice = null;
    saveGame(true);
    render();
  }

  function formatChoiceEffects(effects, compact = false) {
    if (!effects) return compact ? "无明显变化" : "关系与状态暂无变化";
    const labels = [
      ["manager", "主帅"],
      ["fans", "球迷"],
      ["board", "董事会"],
      ["teammates", "队友"],
      ["agent", "经纪人"],
      ["morale", "士气"],
      ["fatigue", "疲劳"]
    ];
    const parts = labels
      .filter(([key]) => typeof effects[key] === "number" && effects[key] !== 0)
      .map(([key, label]) => {
        const value = effects[key];
        return `${label}${value > 0 ? "+" : ""}${value}`;
      });
    if (!parts.length) return compact ? "无明显变化" : "关系与状态暂无变化";
    return compact ? parts.join(" · ") : `影响：${parts.join("，")}`;
  }

  function applyEffects(effects) {
    const state = stateContainer.state;
    const player = state.player;
    if (!effects) return;
    if (typeof effects.manager === "number") state.attitudes.manager = clamp(state.attitudes.manager + effects.manager, 0, 100);
    if (typeof effects.fans === "number") state.attitudes.fans = clamp(state.attitudes.fans + effects.fans, 0, 100);
    if (typeof effects.board === "number") state.attitudes.board = clamp(state.attitudes.board + effects.board, 0, 100);
    if (typeof effects.teammates === "number") state.attitudes.teammates = clamp(state.attitudes.teammates + effects.teammates, 0, 100);
    if (typeof effects.agent === "number") state.attitudes.agent = clamp(state.attitudes.agent + effects.agent, 0, 100);
    if (typeof effects.morale === "number") player.morale = clamp(player.morale + effects.morale, 0, 100);
    if (typeof effects.fatigue === "number") player.fatigue = clamp(player.fatigue + effects.fatigue, 0, 100);
  }

  function advanceWeek(detailed) {
    const state = stateContainer.state;
    if (state.pendingChoice) {
      addLog("warning", "你需要先处理当前的媒体或经纪人事件。");
      render();
      return;
    }
    if (isTransferWindowDue()) {
      runTransferWindow();
      render();
      return;
    }
    const own = currentClub();
    const leagueSeason = ensureLeagueSeason(own.league);
    const euroMatch = getEuropeanMatchForWeek(state.week);
    if (state.week >= leagueSeason.schedule.length && !(euroMatch && state.european?.clubId === own.id)) {
      finishSeason();
      render();
      return;
    }
    if (!state.trainedThisWeek) {
      trainingGain("normal");
      addLog("info", "教练组安排了常规训练，你获得少量成长经验。", "training");
    }
    if (euroMatch && state.european?.clubId === own.id) {
      simulateEuropeanMatch(euroMatch, detailed);
      refreshClubQualifications();
      saveGame(true);
      render();
      return;
    }
    const weekMatches = leagueSeason.schedule[state.week] || [];
    const userMatch = weekMatches.find((match) => match.home === own.id || match.away === own.id);
    weekMatches.forEach((match) => {
      if (match === userMatch) simulateUserMatch(match, detailed);
      else simulateNeutralMatch(own.league, match);
    });
    refreshClubQualifications();
    leagueSeason.simulatedWeeks = Math.max(leagueSeason.simulatedWeeks, state.week + 1);
    if (!userMatch && !euroMatch) {
      addLog("info", "本周没有你的正式比赛，球队完成了训练与恢复。", "match");
    }
    maybeNationalTeamCall();
    state.week += 1;
    state.trainedThisWeek = false;
    maybeUpdateTransferWindowMarket();
    maybeCloseTransferWindow();
    saveGame(true);
    render();
  }

  function isTransferWindowDue() {
    const state = stateContainer.state;
    if (state.week === 0 && !state.windows.summer) return true;
    if (state.week === Math.floor(ensureLeagueSeason(currentClub().league).schedule.length / 2) && !state.windows.winter) return true;
    return false;
  }

  function runTransferWindow() {
    const state = stateContainer.state;
    const type = state.week === 0 ? "summer" : "winter";
    state.windows[type] = true;
    state.market.isOpen = true;
    state.market.windowType = type;
    state.market.offers = [];
    state.market.dealDone = false;
    state.market.lastOfferWeek = state.week;
    const label = type === "summer" ? "夏季转会窗" : "冬季转会窗";
    addLog("warning", `${label}开启。经纪人${state.agent.name}会把真实报价告诉你，但推荐不等于一定能成行。`, "market");
    simulateClubTransfers(type);
    const added = generateOffers(type, { append: false, reason: "open" });
    if (added === 0) {
      addLog("info", `经纪人${state.agent.name}：目前还没有正式报价。你可以调整转会策略，但市场不会保证回应。`, "market");
    }
    saveGame(true);
  }

  function maybeUpdateTransferWindowMarket() {
    const state = stateContainer.state;
    if (!state.market.isOpen || !state.market.windowType) return;
    if (state.market.dealDone) return;
    if (state.week >= transferWindowEndWeek()) return;
    if (state.market.lastOfferWeek === state.week) return;
    state.market.lastOfferWeek = state.week;
    const added = generateOffers(state.market.windowType, { append: true, reason: "weekly" });
    if (added === 0 && random() < 0.35) {
      addLog("info", `经纪人${state.agent.name}本周继续联系俱乐部，但暂时没有新的正式报价。`, "market");
    }
  }

  function transferWindowEndWeek() {
    const state = stateContainer.state;
    const seasonLength = ensureLeagueSeason(currentClub().league).schedule.length;
    if (state.market.windowType === "summer") return 7;
    return Math.floor(seasonLength / 2) + 4;
  }

  function maybeCloseTransferWindow() {
    const state = stateContainer.state;
    if (!state.market.isOpen) return;
    if (state.week < transferWindowEndWeek()) return;
    const label = state.market.windowType === "summer" ? "夏季转会窗" : "冬季转会窗";
    state.market.isOpen = false;
    state.market.windowType = null;
    state.market.lastOfferWeek = null;
    state.market.offers = state.market.offers.filter((offer) => offer.status === "accepted");
    addLog("info", `${label}关闭。未完成的报价已经过期，接下来只能等下一次窗口。`, "market");
  }

  function simulateClubTransfers(type) {
    const state = stateContainer.state;
    const leagueId = currentClub().league;
    const teams = leagueTeams(leagueId);
    const moves = randomInt(type === "summer" ? 7 : 4, type === "summer" ? 13 : 8);
    for (let i = 0; i < moves; i += 1) {
      const target = club(choice(teams));
      const signed = `${choice(FIRST_NAMES)}${randomInt(17, 35)}`;
      let sold = `${choice(FIRST_NAMES)}${randomInt(17, 35)}`;
      if (sold === signed) sold = `${choice(FIRST_NAMES)}${randomInt(17, 35)}`;
      const delta = random() < 0.56 ? randomInt(0, 2) : -randomInt(0, 1);
      target.rating = clamp(target.rating + delta, 50, 95);
      const action = delta >= 0 ? "补强" : "清理阵容";
      addLog(target.id === currentClub().id ? "warning" : "info", `${target.name}完成${action}：签下 ${signed}，出售 ${sold}，球队评级现在为 ${target.rating}。`, "market");
    }
  }

  function generateOffers(type, options = {}) {
    const state = stateContainer.state;
    if (state.market.dealDone) return 0;
    const player = state.player;
    const own = contractClub();
    const playingClub = currentClub();
    const marketIntent = state.market.strategy === "leave" ? "transfer" : state.market.strategy;
    const append = options.append === true;
    const reason = options.reason || "open";
    const targetKind = marketIntent === "loan" ? "seniorLoan" : "seniorTransfer";
    if (!append) state.market.offers = [];

    const evaluatedClubs = CLUBS.filter((candidate) => candidate.id !== own.id && candidate.id !== playingClub.id)
      .filter((candidate) => candidateFitsMarket(candidate, marketIntent))
      .filter((candidate) => !hasExistingMarketOffer(candidate.id, targetKind))
      .map((candidate) => {
        const chance = marketOfferChance(candidate, marketIntent, type);
        return { candidate, chance, attention: marketAttentionScore(candidate, marketIntent) };
      });
    const selectedClubs = selectMarketCandidates(evaluatedClubs, marketIntent, type, append);
    const seniorOffers = selectedClubs.map(({ candidate }) => (marketIntent === "loan" ? makeLoanOffer(candidate) : makeOffer(candidate)));
    const academyOffers = reason === "weekly" ? [] : generateAcademyPoachOffers(type);
    const newOffers = seniorOffers.concat(academyOffers).filter((offer) => !hasExistingMarketOffer(offer.clubId, offer.kind));
    state.market.offers = append ? state.market.offers.concat(newOffers) : newOffers;

    newOffers.forEach((offer) => {
      const prefix = reason === "weekly" ? "本周新动向：" : reason === "strategy" ? "经纪人重新询价：" : "";
      if (offer.kind === "academyPoach") {
        addLog("warning", `${prefix}经纪人${state.agent.name}：${club(offer.clubId).name}梯队想挖角你，方案是${offer.role}，培养补偿约 ${money(offer.fee)}。`, "market");
      } else if (offer.kind === "seniorLoan") {
        addLog("positive", `${prefix}经纪人${state.agent.name}：${club(offer.clubId).name}希望租借你到赛季末，定位${offer.role}，租借费约 ${money(offer.fee)}。`, "market");
      } else {
        addLog("positive", `${prefix}经纪人${state.agent.name}：${club(offer.clubId).name}递交了报价，角色定位是${offer.role}，转会费约 ${money(offer.fee)}。`, "market");
      }
    });
    logScoutingInterest(evaluatedClubs, newOffers, marketIntent, reason);
    return newOffers.length;
  }

  function hasExistingMarketOffer(clubId, kind) {
    const offers = stateContainer.state.market.offers || [];
    return offers.some((offer) => offer.clubId === clubId && offer.kind === kind);
  }

  function isEliteClub(club) {
    return club?.tier === "elite" || (club?.reputation || 0) >= 88;
  }

  function playerOutgrownClub(player, own) {
    if (!player || !own) return false;
    return player.overall >= own.rating + 7 || (player.overall >= 80 && !isEliteClub(own));
  }

  function marketOfferWeight(entry, marketIntent, player, own) {
    const candidate = entry.candidate;
    let weight = entry.chance;
    const outgrown = playerOutgrownClub(player, own);

    if (outgrown) {
      if (isEliteClub(candidate) && isMeaningfulUpgrade(candidate, own) && playerMatchesClubLevel(candidate, player)) {
        weight += 0.22 + clamp((player.overall - own.rating) / 45, 0, 0.2);
      }
      if (candidate.rating < player.overall - 6) weight *= 0.04;
      if (candidate.tier === "small") weight *= 0.015;
      if (candidate.rating <= own.rating + 1 && candidate.reputation <= own.reputation + 4) weight *= 0.08;
    }

    if (marketIntent === "bigger") {
      weight += clubPrestigeScore(candidate) / 420;
      if (!isMeaningfulUpgrade(candidate, own)) weight *= 0.01;
    } else if (marketIntent === "transfer" && outgrown) {
      weight += isEliteClub(candidate) ? clubPrestigeScore(candidate) / 520 : 0;
    }

    return Math.max(0.001, weight);
  }

  function pickWeightedMarketEntries(entries, count, excludeIds = new Set()) {
    const pool = entries.filter((entry) => !excludeIds.has(entry.candidate.id));
    const selected = [];
    while (selected.length < count && pool.length) {
      const total = pool.reduce((sum, entry) => sum + entry.weight, 0);
      let roll = random() * total;
      let pickedIndex = pool.length - 1;
      for (let i = 0; i < pool.length; i += 1) {
        roll -= pool[i].weight;
        if (roll <= 0) {
          pickedIndex = i;
          break;
        }
      }
      selected.push(pool[pickedIndex]);
      pool.splice(pickedIndex, 1);
    }
    return selected;
  }

  function selectMarketCandidates(evaluatedClubs, marketIntent, type, append) {
    const player = stateContainer.state.player;
    const own = contractClub();
    const outgrown = playerOutgrownClub(player, own);
    const maxOffers = append ? (type === "summer" ? 2 : 1) : type === "summer" ? 3 : 2;
    if (!evaluatedClubs.length) return [];
    const minOffers = append ? 0 : 1;
    const targetCount = randomInt(Math.min(minOffers, maxOffers), maxOffers);
    const weighted = evaluatedClubs
      .map((entry) => ({
        ...entry,
        weight: marketOfferWeight(entry, marketIntent, player, own)
      }))
      .sort((a, b) => b.weight - a.weight || clubPrestigeScore(b.candidate) - clubPrestigeScore(a.candidate));

    const selected = [];
    const selectedIds = new Set();

    if (outgrown && (marketIntent === "bigger" || marketIntent === "transfer")) {
      const eliteOptions = weighted.filter(
        (entry) =>
          isEliteClub(entry.candidate) &&
          isMeaningfulUpgrade(entry.candidate, own) &&
          playerMatchesClubLevel(entry.candidate, player)
      );
      if (eliteOptions.length) {
        const [firstElite] = pickWeightedMarketEntries(eliteOptions, 1);
        selected.push(firstElite);
        selectedIds.add(firstElite.candidate.id);
        if (targetCount >= 2 && eliteOptions.length > 1) {
          const secondElite = pickWeightedMarketEntries(eliteOptions, 1, selectedIds)[0];
          if (secondElite) {
            selected.push(secondElite);
            selectedIds.add(secondElite.candidate.id);
          }
        }
      }
    }

    const remaining = weighted.filter((entry) => !selectedIds.has(entry.candidate.id));
    const filler = pickWeightedMarketEntries(remaining, Math.max(0, targetCount - selected.length));
    filler.forEach((entry) => {
      if (outgrown && entry.candidate.rating < player.overall - 8 && !isEliteClub(entry.candidate)) return;
      if (selected.length < targetCount) selected.push(entry);
    });

    return selected.slice(0, targetCount);
  }

  function clubPrestigeScore(club) {
    return club.reputation * 1.35 + club.rating;
  }

  function isMeaningfulUpgrade(candidate, own) {
    const prestigeDelta = clubPrestigeScore(candidate) - clubPrestigeScore(own);
    if (prestigeDelta >= 5) return true;
    if (candidate.reputation >= own.reputation + 2 && candidate.rating >= own.rating - 1) return true;
    if (candidate.reputation > own.reputation && candidate.rating >= own.rating + 2) return true;
    if (isEliteClub(candidate) && !isEliteClub(own) && candidate.rating >= own.rating + 4) return true;
    return false;
  }

  function playerMatchesClubLevel(candidate, player) {
    const abilityGap = candidate.rating - player.overall;
    const upside = Math.max(0, player.potential - player.overall);
    if (abilityGap < -20 && player.potential < candidate.rating + 3) return false;
    if (player.overall - candidate.rating > 10) return false;
    if (player.overall - candidate.rating > 6 && upside <= 2) return false;
    if (player.overall - candidate.rating > 4 && candidate.reputation < player.reputation + 8 && upside <= 4) return false;
    return true;
  }

  function fitsBiggerStage(candidate, own, player) {
    if (!isMeaningfulUpgrade(candidate, own)) return false;
    if (!playerMatchesClubLevel(candidate, player)) return false;

    const atElite = isEliteClub(own);
    const star = player.overall >= 82;
    const worldClass = player.overall >= 87;

    if (atElite && worldClass) {
      if (!isEliteClub(candidate)) return false;
      if (candidate.tier === "small") return false;
      if (candidate.reputation < own.reputation - 1 && candidate.rating <= own.rating) return false;
      if (candidate.rating < player.overall - 8 && candidate.reputation <= own.reputation) return false;
      return candidate.reputation >= own.reputation || candidate.rating >= Math.max(own.rating, player.overall - 6);
    }

    if (atElite && star) {
      if (candidate.tier === "small") return false;
      if (candidate.reputation < own.reputation && candidate.rating <= own.rating + 1) return false;
      if (candidate.rating < player.overall - 10 && candidate.reputation < own.reputation + 4) return false;
    }

    const abilityGap = candidate.rating - player.overall;
    const strongProspect = player.potential >= candidate.rating - (isEliteClub(candidate) ? 2 : 5);
    return abilityGap <= (strongProspect ? 24 : 12);
  }

  function candidateFitsMarket(candidate, marketIntent) {
    const state = stateContainer.state;
    const player = state.player;
    const own = contractClub();
    const abilityGap = candidate.rating - player.overall;
    const playerTooBig = player.overall - candidate.rating;
    const eliteCandidate = candidate.tier === "elite" || candidate.reputation >= 88;
    const strongProspect = player.potential >= candidate.rating - (eliteCandidate ? 2 : 5);

    if (playerTooBig > 14) return false;
    if (marketIntent === "loan") {
      if (player.parentClubId) return false;
      if (playerTooBig > 12) return false;
      return abilityGap <= (strongProspect ? 26 : 14) && abilityGap >= -12;
    }
    if (marketIntent === "minutes") {
      return candidate.rating <= player.overall + 20 && candidate.reputation <= own.reputation + 8 && playerTooBig <= 12;
    }
    if (marketIntent === "bigger") {
      return fitsBiggerStage(candidate, own, player);
    }
    if (marketIntent === "transfer") {
      if (playerOutgrownClub(player, own)) {
        if (candidate.rating < player.overall - 8 && !isMeaningfulUpgrade(candidate, own)) return false;
        if (candidate.tier === "small" && player.overall >= own.rating + 6) return false;
        if (candidate.rating <= own.rating + 2 && candidate.reputation <= own.reputation + 6 && !isEliteClub(candidate)) return false;
      }
      return abilityGap <= (strongProspect ? 32 : 16);
    }
    return candidate.reputation >= own.reputation - 14 && candidate.rating >= player.overall - 8 && abilityGap <= (strongProspect ? 28 : 18);
  }

  function marketOfferChance(candidate, marketIntent, type) {
    const state = stateContainer.state;
    const player = state.player;
    const abilityGap = candidate.rating - player.overall;
    const playerTooBig = player.overall - candidate.rating;
    const upside = Math.max(0, player.potential - player.overall);
    const prospectFit = clamp((player.potential - candidate.rating + 8) / 28, 0, 1);
    const currentReady = clamp((player.overall - candidate.rating + 14) / 30, 0, 1);
    const agentPull = state.attitudes.agent / 100;
    const reputationPull = player.reputation / 100;
    const winterFactor = type === "winter" ? 0.75 : 1;
    let chance;

    if (marketIntent === "loan") {
      const fit = clamp(1 - Math.abs(candidate.rating - (player.overall + 4)) / 28, 0, 1);
      chance = 0.018 + fit * 0.22 + clamp(upside / 45, 0, 0.12) + agentPull * 0.035 + reputationPull * 0.03;
      if (abilityGap > 18) chance *= Math.max(0.12, prospectFit * 0.55);
      if (playerTooBig > 8) chance *= 0.35;
    } else {
      const fit = clamp(1 - Math.abs(candidate.rating - (player.overall + 8)) / 36, 0, 1);
      chance = 0.015 + fit * 0.14 + currentReady * 0.08 + prospectFit * 0.1 + agentPull * 0.035 + reputationPull * 0.04;
      if (marketIntent === "bigger") {
        chance += 0.025;
        if (!isMeaningfulUpgrade(candidate, contractClub())) chance *= 0.04;
        if (player.overall - candidate.rating > 6) chance *= 0.08;
        if (candidate.tier === "small" && isEliteClub(currentClub())) chance *= 0.02;
      } else if (marketIntent === "transfer" && playerOutgrownClub(player, contractClub())) {
        if (isEliteClub(candidate) && isMeaningfulUpgrade(candidate, contractClub())) chance += 0.08;
        if (candidate.rating < player.overall - 6) chance *= 0.05;
      }
      if (marketIntent === "transfer") chance += 0.018;
      if (abilityGap > 18) chance *= Math.max(0.08, prospectFit * 0.42);
      if (playerTooBig > 8) chance *= 0.16;
    }

    if (candidate.tier === "elite" || candidate.reputation >= 88) {
      if (player.overall < candidate.rating - 18) {
        chance *= Math.max(0.06, prospectFit * 0.55);
      } else {
        chance *= 0.9;
      }
    }
    if (candidate.tier === "small" && player.overall >= candidate.rating + 10) chance *= 0.12;
    return clamp(chance * winterFactor, 0.003, marketIntent === "loan" ? 0.42 : 0.36);
  }

  function marketAttentionScore(candidate, marketIntent) {
    const player = stateContainer.state.player;
    const own = contractClub();
    const eliteCandidate = candidate.tier === "elite" || candidate.reputation >= 88;
    if (!eliteCandidate) return 0;
    const outgrown = playerOutgrownClub(player, own);
    if (outgrown) {
      if (!isMeaningfulUpgrade(candidate, own)) return 0;
      if (player.overall < candidate.rating - 14 && player.potential < candidate.rating - 2) return 0;
    } else if (player.overall >= candidate.rating - 12) {
      return 0;
    }
    if (player.potential < candidate.rating - 4 && player.overall < candidate.rating - 10) return 0;
    const intentBoost = marketIntent === "bigger" || marketIntent === "transfer" ? 8 : 0;
    const readyBoost = outgrown && player.overall >= candidate.rating - 10 ? 6 : 0;
    return player.potential - candidate.rating + intentBoost + readyBoost + player.reputation * 0.08;
  }

  function logScoutingInterest(entries, newOffers, marketIntent, reason) {
    if (reason === "open" || random() > 0.48) return;
    const offeredIds = new Set(newOffers.map((offer) => offer.clubId));
    const watchers = entries
      .filter((entry) => entry.attention > 0 && !offeredIds.has(entry.candidate.id))
      .sort((a, b) => b.attention - a.attention)
      .slice(0, 2)
      .map((entry) => entry.candidate.name);
    if (!watchers.length) return;
    const label = marketIntent === "loan" ? "外租培养方案" : "长期潜力";
    addLog("info", `经纪人${stateContainer.state.agent.name}：${watchers.join("、")}派球探继续观察你的${label}，但还没有递交正式报价。`, "market");
  }

  function makeOffer(targetClub) {
    const state = stateContainer.state;
    const player = state.player;
    const role = player.overall >= targetClub.rating - 6 ? "主力" : player.overall >= targetClub.rating - 12 ? "轮换" : "未来计划";
    const fee = Math.round(player.value * (0.85 + random() * 0.55 + (player.contractYears <= 1 ? -0.18 : 0.08)));
    const weeklyWage = Math.round(calculateWage(player, targetClub) * (0.92 + random() * 0.28));
    return {
      id: `${targetClub.id}-${Date.now()}-${randomInt(100, 999)}`,
      kind: "seniorTransfer",
      clubId: targetClub.id,
      fee: Math.max(50000, fee),
      wage: weeklyWage,
      role,
      years: randomInt(2, 5),
      status: "open"
    };
  }

  function makeLoanOffer(targetClub) {
    const player = stateContainer.state.player;
    const role = player.overall >= targetClub.rating - 8 ? "租借主力" : "租借轮换";
    const fee = Math.round(player.value * (0.015 + random() * 0.04));
    return {
      id: `loan-${targetClub.id}-${Date.now()}-${randomInt(100, 999)}`,
      kind: "seniorLoan",
      clubId: targetClub.id,
      fee: Math.max(20000, fee),
      wage: player.wage,
      wageShare: randomInt(40, 100),
      role,
      years: 0,
      status: "open"
    };
  }

  function generateAcademyPoachOffers(type) {
    const state = stateContainer.state;
    const player = state.player;
    if (player.origin !== "academy" || player.age > 18 || player.academyStatus === "firstTeam") return [];
    if (type === "winter" && random() < 0.45) return [];

    const own = currentClub();
    const drawCount = randomInt(0, type === "summer" ? 2 : 1);
    if (drawCount === 0) return [];

    return eliteAcademyClubs()
      .filter((candidate) => candidate.id !== own.id)
      .map((candidate) => ({
        candidate,
        score: candidate.reputation + (player.potential - 86) * 1.5 + player.reputation * 0.35 + randomInt(-12, 12)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, drawCount)
      .map(({ candidate }) => ({
        id: `academy-${candidate.id}-${Date.now()}-${randomInt(100, 999)}`,
        kind: "academyPoach",
        clubId: candidate.id,
        fee: Math.max(50000, Math.round(player.value * (0.08 + random() * 0.08))),
        wage: Math.max(1600, Math.round(calculateWage(player, candidate) * (0.18 + random() * 0.1))),
        role: "梯队核心",
        years: randomInt(2, 3),
        status: "open"
      }));
  }

  function setTransferStrategy(strategy) {
    const state = stateContainer.state;
    if (strategy === "leave") strategy = "transfer";
    if (strategy === "loan" && state.player.parentClubId) {
      addLog("warning", "你已经处于外租期内，不能再次寻求外租。", "market");
      render();
      return;
    }
    state.market.strategy = strategy;
    const labels = {
      stay: "保持现状",
      minutes: "优先出场时间",
      bigger: "寻找更大舞台",
      loan: "寻求外租",
      transfer: "寻求转会"
    };
    const effects = {
      stay: { manager: 2, board: 1, agent: 0 },
      minutes: { manager: -1, board: 0, agent: 2 },
      bigger: { manager: -2, board: -1, agent: 3 },
      loan: { manager: -1, board: 0, agent: 3 },
      transfer: { manager: -5, board: -4, agent: 4 }
    };
    applyEffects(effects[strategy]);
    addLog("info", `你告诉经纪人：${labels[strategy]}。这会影响下个转会窗的询价方向，但不会保证任何俱乐部报价。`, "market");
    if (state.market.isOpen) {
      if (state.market.dealDone) {
        addLog("info", `本窗口内已完成转会/租借，经纪人${state.agent.name}不会再为你联系新的俱乐部。`, "market");
      } else {
        state.market.lastOfferWeek = state.week;
        const added = generateOffers(state.market.windowType, { append: true, reason: "strategy" });
        if (added === 0) {
          addLog("info", `经纪人${state.agent.name}重新询价后，暂时没有新的正式报价。`, "market");
        }
      }
    }
    saveGame(true);
    render();
  }

  function finalizeTransferWindowDeal() {
    const state = stateContainer.state;
    if (state.market.dealDone) return;
    state.market.dealDone = true;
    state.market.offers.forEach((offer) => {
      if (offer.status === "open") offer.status = "expired";
    });
    addLog("info", "本窗口内已完成转会/租借，其余报价自动失效，且不会再收到新报价。", "market");
  }

  function rejectOffer(index) {
    const state = stateContainer.state;
    const offer = state.market.offers[index];
    if (!offer || offer.status !== "open") return;
    const target = club(offer.clubId);
    const label = offer.kind === "seniorLoan" ? "外租邀请" : offer.kind === "academyPoach" ? "梯队挖角" : "转会报价";
    offer.status = "declined";
    addLog("info", `你通过经纪人拒绝了${target.name}的${label}。`, "market");
    saveGame(true);
    render();
  }

  function acceptOffer(index) {
    const state = stateContainer.state;
    const offer = state.market.offers[index];
    if (!offer || offer.status !== "open") return;
    if (offer.kind === "academyPoach") {
      acceptAcademyPoachOffer(offer);
      saveGame(true);
      render();
      return;
    }
    if (offer.kind === "seniorLoan") {
      acceptLoanOffer(offer);
      saveGame(true);
      render();
      return;
    }
    const target = club(offer.clubId);
    const player = state.player;
    const own = contractClub();
    const sellPressure = player.contractYears <= 1 ? 24 : 0;
    const feePressure = (offer.fee / Math.max(1, player.value) - 0.85) * 38;
    const boardMood = (100 - state.attitudes.board) * 0.15;
    const acceptance = clamp(42 + sellPressure + feePressure + boardMood - (own.reputation - target.reputation) * 0.12, 8, 92);
    if (random() * 100 > acceptance) {
      offer.status = "rejected";
      state.attitudes.board = clamp(state.attitudes.board - 2, 0, 100);
      addLog("negative", `${own.name}拒绝放人：他们认为 ${money(offer.fee)} 还不足以带走你。`, "market");
      saveGame(true);
      render();
      return;
    }
    transferPlayer(offer);
    offer.status = "accepted";
    finalizeTransferWindowDeal();
    saveGame(true);
    render();
  }

  function acceptLoanOffer(offer) {
    const state = stateContainer.state;
    const player = state.player;
    if (player.parentClubId) {
      offer.status = "rejected";
      addLog("warning", "你已经完成外租，本窗口内不能再接受另一份外租邀请。", "market");
      return;
    }
    const parent = contractClub();
    const target = club(offer.clubId);
    const review = evaluateLoanApproval(offer, parent, target);
    if (random() * 100 > review.acceptance) {
      offer.status = "rejected";
      state.attitudes.manager = clamp(state.attitudes.manager - 1, 0, 100);
      addLog("negative", `${parent.name}拒绝外租：${review.reason}`, "market");
      return;
    }
    loanPlayer(offer);
    offer.status = "accepted";
    finalizeTransferWindowDeal();
  }

  function evaluateLoanApproval(offer, parent, target) {
    const state = stateContainer.state;
    const player = state.player;
    const roleScore = offer.role === "租借主力" ? 30 : 12;
    const needsMinutes = player.role === "未来计划" || player.role === "青训合同到期" || player.overall < parent.rating - 10;
    const minutesNeed = needsMinutes ? 14 : 4;
    const levelGap = target.rating - player.overall;
    const levelFit = clamp(18 - Math.abs(levelGap - 4) * 1.5, -18, 18);
    const leagueFit = LEAGUES[target.league]?.level <= LEAGUES[parent.league]?.level + 1 ? 5 : -5;
    const reputationFit = clamp((target.reputation - 62) * 0.16, -8, 8);
    const feeScore = clamp((offer.fee / Math.max(1, player.value)) * 180, 0, 14);
    const relationshipScore = (state.attitudes.manager - 50) * 0.12 + (state.attitudes.board - 50) * 0.1 + (state.attitudes.agent - 50) * 0.08;
    const keepPenalty = player.overall >= parent.rating - 4 ? 18 : player.overall >= parent.rating - 8 ? 8 : 0;
    const acceptance = clamp(34 + roleScore + minutesNeed + levelFit + leagueFit + reputationFit + feeScore + relationshipScore - keepPenalty, offer.role === "租借主力" ? 42 : 18, 96);

    let reason = "教练组仍希望你留队竞争位置。";
    if (keepPenalty >= 18) {
      reason = "母队认为你已经接近一线队轮换水平，暂时不想放你离队。";
    } else if (levelGap > 18) {
      reason = `${target.name}整体强度太高，母队担心你即使名义上是${offer.role}，实际出场仍无法保证。`;
    } else if (levelGap < -12) {
      reason = `${target.name}比赛强度偏低，母队认为这段外租对成长帮助有限。`;
    } else if (offer.role !== "租借主力") {
      reason = `${target.name}只承诺租借轮换，母队认为出场时间还不够稳定。`;
    } else if (feeScore < 3 && state.attitudes.board < 48) {
      reason = "董事会认为租借补偿和薪水承担比例不足。";
    }

    return { acceptance, reason };
  }

  function acceptAcademyPoachOffer(offer) {
    const state = stateContainer.state;
    const player = state.player;
    const oldClub = currentClub();
    const target = club(offer.clubId);
    const releaseChance = player.contractYears <= 1 ? 88 : clamp(42 + (offer.fee / Math.max(1, player.value)) * 180 - (oldClub.reputation - target.reputation) * 0.25, 12, 78);

    if (random() * 100 > releaseChance) {
      offer.status = "rejected";
      state.attitudes.board = clamp(state.attitudes.board - 2, 0, 100);
      state.attitudes.manager = clamp(state.attitudes.manager - 1, 0, 100);
      addLog("negative", `${oldClub.name}拒绝放走你去${target.name}梯队：他们认为补偿不够，或者仍想留你完成培养周期。`, "market");
      return;
    }

    const outcome = {
      type: "academyContract",
      clubId: target.id,
      status: "academy",
      role: offer.role,
      years: offer.years,
      wage: offer.wage,
      log: `青训挖角完成：你从${oldClub.name}转入${target.name}梯队，合同 ${offer.years} 年，定位${offer.role}。`
    };
    applyChoiceOutcome({ outcome, tone: "positive", tag: "market" });
    offer.status = "accepted";
    finalizeTransferWindowDeal();
  }

  function transferPlayer(offer) {
    const state = stateContainer.state;
    const player = state.player;
    const oldClub = contractClub();
    const target = club(offer.clubId);
    trackClubMove({
      type: offer.fee <= 0 ? "free" : "transfer",
      fromClubId: oldClub.id,
      toClubId: target.id,
      fee: offer.fee,
      feeLabel: offer.fee <= 0 ? "自由身" : money(offer.fee)
    });
    player.clubId = target.id;
    player.parentClubId = null;
    player.loanUntilSeasonYear = null;
    player.contractYears = offer.years;
    player.wage = offer.wage;
    player.role = offer.role;
    player.reputation = clamp(player.reputation + (target.reputation - oldClub.reputation) * 0.08 + 3, 0, 100);
    state.attitudes.manager = offer.role === "主力" ? 62 : offer.role === "轮换" ? 55 : 48;
    state.attitudes.board = 58;
    state.attitudes.fans = clamp(48 + player.reputation * 0.22, 0, 100);
    state.attitudes.teammates = 52;
    ensureLeagueSeason(target.league);
    catchUpLeague(target.league, state.week);
    addLog("positive", `转会完成：你从${oldClub.name}加盟${target.name}，合同 ${offer.years} 年，薪水 ${wage(offer.wage)}，定位${offer.role}。`, "market");
  }

  function loanPlayer(offer) {
    const state = stateContainer.state;
    const player = state.player;
    const parent = contractClub();
    const target = club(offer.clubId);
    trackClubMove({
      type: "loan",
      fromClubId: parent.id,
      toClubId: target.id,
      fee: offer.fee,
      feeLabel: "租借",
      isLoan: true,
      parentClubId: parent.id
    });
    player.parentClubId = parent.id;
    player.loanUntilSeasonYear = state.seasonYear;
    player.clubId = target.id;
    player.role = offer.role;
    player.reputation = clamp(player.reputation + 1.5, 0, 100);
    state.attitudes.manager = offer.role === "租借主力" ? 61 : 54;
    state.attitudes.board = 55;
    state.attitudes.fans = clamp(42 + player.reputation * 0.2, 0, 100);
    state.attitudes.teammates = 50;
    ensureLeagueSeason(target.league);
    catchUpLeague(target.league, state.week);
    addLog("positive", `外租完成：你从${parent.name}租借加盟${target.name}至赛季末，定位${offer.role}。母队合同和薪水保持不变。`, "market");
  }

  function catchUpLeague(leagueId, weekTarget) {
    const season = ensureLeagueSeason(leagueId);
    while (season.simulatedWeeks < weekTarget && season.simulatedWeeks < season.schedule.length) {
      const weekMatches = season.schedule[season.simulatedWeeks];
      weekMatches.forEach((match) => simulateNeutralMatch(leagueId, match));
      season.simulatedWeeks += 1;
    }
  }

  function pickNationalOpponent(nationality) {
    const conf = nationConfederation(nationality);
    const pool = NATIONALITIES.filter((name) => name !== nationality && nationConfederation(name) === conf);
    return choice(pool.length ? pool : NATIONALITIES.filter((name) => name !== nationality));
  }

  function simulateNationalTeamMatch() {
    const state = stateContainer.state;
    const player = state.player;
    const national = player.national;
    const opponentNation = pickNationalOpponent(player.nationality);
    const strength = nationStrength(player.nationality);
    const oppStrength = nationStrength(opponentNation);
    const minutes = randomInt(55, 90);
    const importance = 0.12;
    const contribution = contributionFromPerformance(minutes, oppStrength, importance);
    const ownGoals = contribution.goals;
    const oppGoals = clamp(Math.round(randomInt(0, 2) + (oppStrength - strength) / 28 + (contribution.rating - 6.8) * -0.35), 0, 4);
    const won = ownGoals > oppGoals;
    const drawn = ownGoals === oppGoals;
    Object.assign(
      contribution,
      finalizeMatchContribution(contribution, {
        won,
        drawn,
        ownGoals,
        oppGoals,
        isGoalkeeper: positionLine(player.position) === "goalkeeper"
      })
    );

    national.caps += 1;
    national.goals += contribution.goals;
    national.assists += contribution.assists;
    national.season.caps += 1;
    national.season.goals += contribution.goals;
    national.season.assists += contribution.assists;
    player.careerStats.internationalGoals += contribution.goals;
    player.xp += Math.round(contribution.xp * 0.75);
    maybeImprovePlayer();
    player.reputation = clamp(player.reputation + (won ? 2 : drawn ? 1 : 0), 0, 100);
    player.morale = clamp(player.morale + (won ? 5 : drawn ? 2 : -1), 0, 100);

    const resultText = `${player.nationality} ${ownGoals}-${oppGoals} ${opponentNation}`;
    national.matches.unshift({
      date: fmtDate(),
      opponent: opponentNation,
      result: resultText,
      minutes,
      goals: contribution.goals,
      assists: contribution.assists,
      rating: contribution.rating,
      won,
      drawn
    });
    national.matches = national.matches.slice(0, 12);
    addLog(won ? "positive" : drawn ? "info" : "negative", `国家队比赛：${resultText}（友谊赛）。你出场 ${minutes} 分钟，评分 ${contribution.rating.toFixed(1)}${contribution.goals ? `，进 ${contribution.goals} 球` : ""}${contribution.assists ? `，${contribution.assists} 助攻` : ""}。`, "national");
  }

  function maybeNationalTeamCall() {
    const state = stateContainer.state;
    const player = state.player;
    if (![7, 14, 24, 31].includes(state.week)) return;
    const seasonAvg = player.season.ratedMatches ? player.season.ratingTotal / player.season.ratedMatches : 6.2;
    const threshold = 69 + Math.max(0, 78 - player.reputation) * 0.08;
    const chance = clamp((player.overall - threshold) * 8 + (seasonAvg - 6.7) * 18 + player.reputation * 0.18, 0, 85);
    if (random() * 100 < chance) {
      player.national.callUps += 1;
      addLog("positive", `${player.nationality}国家队征召你参加本期国际比赛日。`, "national");
      simulateNationalTeamMatch();
    } else {
      addLog("info", `${player.nationality}国家队公布名单，你暂时没有入选。经纪人提醒：能力、出场和稳定评分都会影响下次机会。`, "national");
    }
  }

  function recordSeasonHonors(context) {
    const state = stateContainer.state;
    const player = state.player;
    recordCareerSeasonStats(player.season);
    evaluateInternationalHonors(context);
    const honorContext = {
      ...context,
      wonContinental: !!state.european?.won,
      wonLeague: context.rank === 1,
      europeanGoals: state.european?.stats?.goals || 0,
      europeanCompetition: state.european?.competition || null,
      internationalTitles: (player.honors || []).filter(
        (honor) => honor.category === "international" && honor.seasonYear === context.seasonYear && honor.title.includes("冠军")
      ).length
    };
    evaluateLeagueHonors(honorContext);
    evaluateEuropeanHonors(honorContext);
  }

  function recordCareerSeasonStats(season) {
    const stats = stateContainer.state.player.careerStats;
    stats.appearances += season.appearances;
    stats.goals += season.goals;
    stats.assists += season.assists;
    stats.cleanSheets += season.cleanSheets;
    flushSeasonToClubStint(stateContainer.state.player, season);
  }

  function addHonor(category, title, subtitle, tier = "standard", meta = {}) {
    const state = stateContainer.state;
    const player = state.player;
    const seasonYear = meta.seasonYear ?? state.seasonYear;
    const id = `${seasonYear}-${category}-${title}-${meta.competition || ""}`;
    if (player.honors.some((honor) => honor.id === id)) return false;
    const honor = {
      id,
      category,
      title,
      subtitle,
      tier,
      seasonYear,
      date: `${seasonYear}/${String(seasonYear + 1).slice(2)}`,
      meta
    };
    player.honors.unshift(honor);
    if (title.includes("冠军") || title.includes("升级")) player.careerStats.trophies += 1;
    if (["金靴", "金球", "最佳", "金手套"].some((word) => title.includes(word))) {
      player.careerStats.personalAwards += 1;
    }
    player.reputation = clamp(player.reputation + (tier === "legend" ? 6 : tier === "gold" ? 3 : 1), 0, 100);
    addLog("positive", `荣誉入账：${title}。${subtitle}`, "honors");
    return true;
  }

  function evaluateLeagueHonors({ club: own, rank, qualification, avgRating, seasonYear, wonContinental, wonLeague, internationalTitles }) {
    const player = stateContainer.state.player;
    const season = player.season;
    const league = LEAGUES[own.league];
    if (!league) return;
    const hasMajorClubSuccess = wonLeague || rank <= 4 || wonContinental || ["欧冠", "欧冠资格赛", "欧联", "欧协联"].includes(qualification);

    if (rank === 1) {
      addHonor("club", `${league.name}冠军`, `${own.name}以联赛第 1 名结束赛季。`, "gold", { competition: league.name, seasonYear });
    } else if (qualification === "升级") {
      addHonor("club", `${league.name}升级`, `${own.name}拿到直接升级资格。`, "gold", { competition: league.name, seasonYear });
    } else if (qualification === "升级附加赛" && random() < 0.42) {
      addHonor("club", `${league.name}升级附加赛冠军`, `${own.name}通过附加赛完成升级。`, "gold", { competition: league.name, seasonYear });
    }

    const leagueGoalLine = league.level > 1 ? 16 : 21;
    const topGoals = leagueTopGoals(own.league);
    if (positionLine(player.position) !== "goalkeeper" && season.goals >= leagueGoalLine && season.goals >= topGoals) {
      addHonor("personal", `${league.name}金靴`, `${season.goals} 粒联赛进球领跑射手榜。`, "gold", { competition: league.name, goals: season.goals, seasonYear });
    }
    if (positionLine(player.position) === "goalkeeper" && season.cleanSheets >= (league.level > 1 ? 11 : 14)) {
      addHonor("personal", `${league.name}金手套`, `${season.cleanSheets} 场零封成为联赛最佳门将。`, "gold", { competition: league.name, cleanSheets: season.cleanSheets, seasonYear });
    }
    if (hasMajorClubSuccess && season.appearances >= 15 && avgRating >= 7.15) {
      addHonor("personal", `${league.name}赛季最佳阵容`, `场均评分 ${avgRating.toFixed(2)}，入选联赛最佳阵容。`, "standard", { competition: league.name, seasonYear });
    }
    if (hasMajorClubSuccess && season.appearances >= 18 && avgRating >= 7.38 && season.goals + season.assists >= 12) {
      addHonor("personal", `${league.name}最佳球员`, `赛季 ${season.goals} 球 ${season.assists} 助攻，场均评分 ${avgRating.toFixed(2)}，并随队取得重要成绩。`, "gold", { competition: league.name, seasonYear });
    }
    if (league.level === 1 && season.goals >= 30 && season.goals >= topGoals) {
      addHonor("personal", "欧洲金靴", `${season.goals} 粒联赛进球让你登顶欧洲射手榜。`, "legend", { competition: "欧洲联赛", goals: season.goals, seasonYear });
    }
    const ballonScore = player.overall * 0.62 + avgRating * 8 + season.goals * 0.48 + season.assists * 0.32 + player.reputation * 0.22 + (rank === 1 ? 8 : 0);
    const canWinBallon = wonLeague || wonContinental || internationalTitles > 0;
    if (canWinBallon && ballonScore >= 122 && random() < clamp((ballonScore - 112) / 28, 0.18, 0.82)) {
      addHonor("personal", "金球奖", `你凭借俱乐部与国家队的重要荣誉，以及稳定个人表现，被评为年度世界最佳球员。`, "legend", { competition: "世界足坛", score: Math.round(ballonScore), seasonYear });
    }
  }

  function evaluateEuropeanHonors({ club: own, rank, qualification, avgRating, seasonYear, wonContinental, europeanGoals, europeanCompetition }) {
    const player = stateContainer.state.player;
    const league = LEAGUES[own.league];
    if (!league || league.level !== 1) return;

    const competition = europeanCompetition || europeanCompetitionForSeason(own.league, rank, qualification);
    if (!competition) return;
    const goals = europeanGoals || estimateCupGoals(competition, avgRating);
    if (!stateContainer.state.european?.stats?.appearances) {
      player.careerStats.europeanGoals += goals;
      if (competition === "欧冠") player.careerStats.uclGoals += goals;
    }

    if (wonContinental) {
      addHonor("continental", `${competition}冠军`, `${own.name}在${competition}淘汰赛中走到最后，你贡献 ${goals} 球。`, "legend", { competition, goals, seasonYear });
    }
    const goldenBootLine = competition === "欧冠" ? 6 : competition === "欧联" ? 5 : 4;
    if (positionLine(player.position) !== "goalkeeper" && goals >= goldenBootLine) {
      addHonor("personal", `${competition}金靴`, `${goals} 粒进球成为本赛季${competition}最佳射手。`, "legend", { competition, goals, seasonYear });
    }
    if (wonContinental && avgRating >= 7.2 && goals >= Math.max(2, goldenBootLine - 3)) {
      addHonor("personal", `${competition}最佳球员`, `你在${competition}夺冠征程中贡献 ${goals} 球，关键战表现突出。`, "gold", { competition, goals, seasonYear });
    }
  }

  function europeanCompetitionForSeason(leagueId, rank, qualification) {
    const rules = effectiveRules(leagueId);
    if (!rules) return null;
    const uclLine = (rules.ucl || 0) + (rules.uclQ || 0);
    const uelLine = uclLine + (rules.uel || 0);
    const ueclLine = uelLine + (rules.uecl || 0);
    if (rank <= uclLine || ["欧冠", "欧冠资格赛"].includes(qualification)) return "欧冠";
    if (rank <= uelLine || qualification === "欧联") return "欧联";
    if (rank <= ueclLine || qualification === "欧协联") return "欧协联";
    return null;
  }

  function estimateCupGoals(competition, avgRating) {
    const player = stateContainer.state.player;
    if (positionLine(player.position) === "goalkeeper") return 0;
    const season = player.season;
    const factor = competition === "欧冠" ? 0.34 : competition === "欧联" ? 0.28 : 0.24;
    const roleBoost = ["主力", "租借主力"].includes(player.role) ? 1.15 : player.role === "轮换" ? 0.82 : 0.55;
    const ratingBoost = clamp(avgRating - 6.5, 0, 1.8);
    return Math.max(0, Math.round(season.goals * factor * roleBoost + ratingBoost + randomInt(-1, 2)));
  }

  function evaluateInternationalHonors({ avgRating, seasonYear }) {
    const player = stateContainer.state.player;
    const summerYear = seasonYear + 1;
    const tournaments = internationalTournamentsForYear(player.nationality, summerYear);
    tournaments.forEach((tournament) => simulateInternationalTournament(tournament, avgRating, seasonYear));
  }

  function internationalTournamentsForYear(nationality, year) {
    const conf = nationConfederation(nationality);
    const tournaments = [];
    if ((year - 2026) % 4 === 0) tournaments.push({ name: "世界杯", year, global: true });
    if (conf === "UEFA" && (year - 2028) % 4 === 0) tournaments.push({ name: "欧洲杯", year });
    if (conf === "CONMEBOL" && (year - 2028) % 4 === 0) tournaments.push({ name: "美洲杯", year });
    if (conf === "AFC" && (year - 2027) % 4 === 0) tournaments.push({ name: "亚洲杯", year });
    if (conf === "CONCACAF" && year % 2 === 1) tournaments.push({ name: "中北美金杯赛", year });
    return tournaments;
  }

  function nationConfederation(nationality) {
    if (["英格兰", "法国", "德国", "西班牙", "意大利", "葡萄牙", "荷兰", "克罗地亚", "比利时"].includes(nationality)) return "UEFA";
    if (["巴西", "阿根廷", "乌拉圭"].includes(nationality)) return "CONMEBOL";
    if (["中国", "日本", "韩国"].includes(nationality)) return "AFC";
    if (nationality === "美国") return "CONCACAF";
    return "OTHER";
  }

  function nationStrength(nationality) {
    return {
      巴西: 92,
      阿根廷: 91,
      法国: 91,
      英格兰: 88,
      西班牙: 88,
      德国: 87,
      葡萄牙: 86,
      荷兰: 85,
      意大利: 84,
      比利时: 83,
      克罗地亚: 82,
      乌拉圭: 80,
      美国: 74,
      日本: 73,
      韩国: 72,
      中国: 62
    }[nationality] || 68;
  }

  function simulateInternationalTournament(tournament, avgRating, seasonYear) {
    const state = stateContainer.state;
    const player = state.player;
    const national = player.national;
    const selectionChance = clamp((player.overall - 68) * 0.08 + (player.reputation - 45) * 0.012 + (avgRating - 6.6) * 0.12, 0.05, 0.96);
    if (random() > selectionChance) return;

    const appearances = randomInt(2, tournament.name === "世界杯" ? 7 : 6);
    let goals = 0;
    let assists = 0;
    for (let i = 0; i < appearances; i += 1) {
      const opponentNation = pickNationalOpponent(player.nationality);
      const minutes = randomInt(45, 90);
      const contribution = contributionFromPerformance(minutes, nationStrength(opponentNation), 0.18);
      const ownGoals = contribution.goals;
      const oppGoals = clamp(randomInt(0, 3), 0, 4);
      goals += contribution.goals;
      assists += contribution.assists;
      national.matches.unshift({
        date: `${tournament.year}-${String(randomInt(6, 7)).padStart(2, "0")}-${String(randomInt(10, 28)).padStart(2, "0")}`,
        opponent: opponentNation,
        result: `${player.nationality} ${ownGoals}-${oppGoals} ${opponentNation}`,
        minutes,
        goals: contribution.goals,
        assists: contribution.assists,
        rating: contribution.rating,
        tournament: tournament.name,
        won: ownGoals > oppGoals,
        drawn: ownGoals === oppGoals
      });
    }
    national.matches = national.matches.slice(0, 16);
    national.caps += appearances;
    national.goals += goals;
    national.assists += assists;
    national.season.caps += appearances;
    national.season.goals += goals;
    national.season.assists += assists;
    player.careerStats.internationalGoals += goals;
    addLog("info", `${player.nationality}国家队征召你参加${tournament.year}年${tournament.name}，你出场 ${appearances} 次，打进 ${goals} 球。`, "national");

    const strength = nationStrength(player.nationality);
    const winChance = clamp((strength - 74) * 0.012 + (player.overall - 78) * 0.01 + (avgRating - 6.8) * 0.06 + goals * 0.01, 0.01, tournament.name === "世界杯" ? 0.28 : 0.42);
    const wonTournament = random() < winChance;
    if (wonTournament) {
      addHonor("international", `${tournament.name}冠军`, `${player.nationality}在${tournament.year}年${tournament.name}夺冠，你贡献 ${goals} 球。`, "legend", { competition: tournament.name, year: tournament.year, goals, seasonYear });
    }
    const goldenBootLine = tournament.name === "世界杯" ? 6 : 5;
    if (positionLine(player.position) !== "goalkeeper" && goals >= goldenBootLine) {
      addHonor("personal", `${tournament.name}金靴`, `${goals} 粒进球成为${tournament.year}年${tournament.name}最佳射手。`, "legend", { competition: tournament.name, year: tournament.year, goals, seasonYear });
    }
    if (wonTournament && avgRating >= 7.2 && goals >= Math.max(2, goldenBootLine - 2)) {
      addHonor("personal", `${tournament.name}最佳球员`, `你在${tournament.year}年${tournament.name}夺冠征程中成为赛事最佳球员。`, "legend", { competition: tournament.name, year: tournament.year, goals, seasonYear });
    }
  }

  function estimateInternationalGoals(appearances, avgRating) {
    const player = stateContainer.state.player;
    const line = positionLine(player.position);
    if (line === "goalkeeper" || line === "defender") return 0;
    const positionFactor = line === "attacker" ? 0.48 : 0.24;
    const ratingFactor = clamp(avgRating - 6.2, 0, 2.4);
    return Math.max(0, Math.round(appearances * positionFactor + ratingFactor + randomInt(-1, 2)));
  }

  function finishSeason() {
    const state = stateContainer.state;
    const player = state.player;
    const own = currentClub();
    const table = sortedTable(own.league);
    const rank = table.findIndex((row) => row.teamId === own.id) + 1;
    const qualification = placementLabel(own.league, rank, table.length);
    player.contractYears -= 1;
    player.age += 1;
    player.fatigue = clamp(player.fatigue - 45, 0, 100);
    player.form = clamp(player.form * 0.35, -8, 8);
    const avgRating = player.season.ratedMatches ? player.season.ratingTotal / player.season.ratedMatches : 0;
    player.reputation = clamp(player.reputation + Math.max(0, avgRating - 6.4) * 3 + player.season.goals * 0.18 + player.season.assists * 0.12, 0, 100);
    addLog("warning", `${state.seasonYear}/${String(state.seasonYear + 1).slice(2)} 赛季结束：${own.name}排名第 ${rank}，${qualification || "无额外资格"}。你的赛季数据：${player.season.appearances} 场 ${player.season.goals} 球 ${player.season.assists} 助攻。`, "career");
    refreshClubQualifications();
    recordSeasonHonors({ club: own, rank, qualification, avgRating, seasonYear: state.seasonYear });
    const nextEuropean = europeanCompetitionForSeason(own.league, rank, qualification);
    maybeBreakPotential(avgRating, qualification);
    returnFromLoanIfNeeded();
    handleContractDecision();
    state.seasonYear += 1;
    state.week = 0;
    state.windows = { summer: false, winter: false };
    state.market.isOpen = false;
    state.market.offers = [];
    state.euroBonusLeagues = drawEuroBonusLeagues();
    state.leagues = {};
    ensureLeagueSeason(currentClub().league);
    setupEuropeanCampaign(nextEuropean, own.id);
    refreshClubQualifications();
    player.season = freshSeasonStats();
    if (player.national?.season) {
      player.national.season = { caps: 0, goals: 0, assists: 0 };
    }
    addLog("info", euroBonusSummary(), "table");
    saveGame(true);
  }

  function maybeBreakPotential(avgRating, qualification) {
    const player = stateContainer.state.player;
    const season = player.season;
    if (player.potential >= 99 || season.ratedMatches < 8) return;
    const nearCeilingBonus = player.overall >= player.potential - 2 ? 9 : player.overall >= player.potential - 5 ? 4 : 0;
    const outputBonus = Math.min(10, season.goals * 0.35 + season.assists * 0.28 + season.cleanSheets * 0.45);
    const qualificationBonus = ["欧冠", "欧冠资格赛", "欧联", "欧协联", "升级"].includes(qualification) ? 4 : qualification === "升级附加赛" ? 2 : 0;
    const agePenalty = Math.max(0, player.age - 24) * 2.2;
    const chance = clamp((avgRating - 6.85) * 18 + Math.min(10, season.appearances * 0.42) + outputBonus + qualificationBonus + nearCeilingBonus - agePenalty, 0, 28);
    if (random() * 100 >= chance) return;
    const oldPotential = player.potential;
    const extraPointChance = avgRating >= 7.45 && chance >= 18 ? 0.24 : 0.08;
    const gain = random() < extraPointChance ? 2 : 1;
    player.potential = Math.min(99, player.potential + gain);
    player.value = calculateValue(player);
    addLog("positive", `突破潜力：这个赛季的表现让外界重新评估了你的上限，潜力从 ${oldPotential} 提升到 ${player.potential}。`, "training");
  }

  function returnFromLoanIfNeeded() {
    const state = stateContainer.state;
    const player = state.player;
    if (!player.parentClubId) return;
    const loanClub = currentClub();
    const parent = club(player.parentClubId);
    trackClubMove({
      type: "loanReturn",
      fromClubId: loanClub.id,
      toClubId: parent.id,
      fee: 0,
      feeLabel: "租借回归"
    });
    player.clubId = parent.id;
    player.parentClubId = null;
    player.loanUntilSeasonYear = null;
    player.role = player.overall >= parent.rating - 8 ? "轮换" : "未来计划";
    state.attitudes.manager = 54;
    state.attitudes.board = 56;
    state.attitudes.fans = clamp(46 + player.reputation * 0.2, 0, 100);
    state.attitudes.teammates = 52;
    addLog("info", `租借期结束：你结束在${loanClub.name}的外租，回到母队${parent.name}。新赛季定位暂定为${player.role}。`, "market");
  }

  function handleContractDecision() {
    const state = stateContainer.state;
    const player = state.player;
    const own = currentClub();
    if (player.contractYears > 0) {
      const renewChance = clamp(player.overall - own.rating + state.attitudes.manager * 0.38 + state.attitudes.board * 0.24, 5, 86);
      if (player.contractYears <= 1 && random() * 100 < renewChance) {
        player.contractYears += randomInt(2, 4);
        player.wage = Math.round(calculateWage(player, own) * (1.03 + random() * 0.25));
        addLog("positive", `经纪人${state.agent.name}：${own.name}愿意续约，合同延长到 ${player.contractYears} 年，薪水调整为 ${wage(player.wage)}。`, "agent");
      }
      return;
    }
    const keepChance = clamp(state.attitudes.manager * 0.45 + state.attitudes.board * 0.35 + player.overall - own.rating + 8, 0, 88);
    if (random() * 100 < keepChance) {
      player.contractYears = randomInt(1, 3);
      player.wage = Math.round(calculateWage(player, own) * (0.95 + random() * 0.18));
      addLog("positive", `经纪人${state.agent.name}：${own.name}最后时刻给出续约，合同 ${player.contractYears} 年。`, "agent");
      return;
    }
    const fallback = findFallbackClub();
    const offer = makeOffer(fallback);
    offer.years = randomInt(1, 3);
    offer.fee = 0;
    transferPlayer(offer);
    addLog("warning", `合同到期后${own.name}没有续约，你以自由身寻找下家。`, "agent");
  }

  function findFallbackClub() {
    const player = stateContainer.state.player;
    const candidates = CLUBS.filter((candidate) => candidate.rating <= player.overall + 13 && candidate.rating >= player.overall - 14);
    return choice(candidates.length ? candidates : CLUBS);
  }

  function freshSeasonStats() {
    return {
      appearances: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      ratingTotal: 0,
      ratedMatches: 0
    };
  }

  function freshCareerStats() {
    return {
      appearances: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      uclGoals: 0,
      europeanGoals: 0,
      internationalGoals: 0,
      trophies: 0,
      personalAwards: 0
    };
  }

  function normalizeCareerStats(stats) {
    const defaults = freshCareerStats();
    Object.keys(defaults).forEach((key) => {
      if (typeof stats[key] !== "number") stats[key] = defaults[key];
    });
  }

  function freshCareerHistory() {
    return { transfers: [], clubStints: [] };
  }

  function getActiveClubStint(player) {
    return (player.careerHistory?.clubStints || []).find((stint) => stint.toSeasonYear == null) || null;
  }

  function fmtCareerDotDate(seasonYear, week) {
    const date = new Date(seasonYear, 6, 12 + week * 7);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
  }

  function fmtCareerFullDate(seasonYear, week) {
    const date = new Date(seasonYear, 6, 12 + week * 7);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  }

  function fmtStintRange(stint) {
    const start = fmtCareerFullDate(stint.fromSeasonYear, stint.fromWeek);
    const end = stint.toSeasonYear == null ? "至今" : fmtCareerFullDate(stint.toSeasonYear, stint.toWeek);
    return `${start} ~ ${end}`;
  }

  function openClubStint(player, clubId, meta = {}) {
    const state = stateContainer.state;
    if (!player.careerHistory) player.careerHistory = freshCareerHistory();
    player.careerHistory.clubStints.push({
      clubId,
      fromSeasonYear: state.seasonYear,
      fromWeek: state.week,
      toSeasonYear: null,
      toWeek: null,
      appearances: 0,
      goals: 0,
      assists: 0,
      isLoan: !!meta.isLoan,
      parentClubId: meta.parentClubId || null
    });
  }

  function flushSeasonToClubStint(player, season = player.season) {
    const active = getActiveClubStint(player);
    if (!active || !season) return;
    active.appearances += season.appearances;
    active.goals += season.goals;
    active.assists += season.assists;
    season.appearances = 0;
    season.goals = 0;
    season.assists = 0;
  }

  function closeCurrentClubStint(player, state = stateContainer.state) {
    flushSeasonToClubStint(player);
    const active = getActiveClubStint(player);
    if (!active || !state) return;
    active.toSeasonYear = state.seasonYear;
    active.toWeek = state.week;
  }

  function recordCareerTransfer({ type, fromClubId, toClubId, fee = 0, feeLabel = "" }) {
    const state = stateContainer.state;
    const player = state.player;
    if (!player.careerHistory) player.careerHistory = freshCareerHistory();
    player.careerHistory.transfers.unshift({
      type,
      fromClubId,
      toClubId,
      fee,
      feeLabel,
      seasonYear: state.seasonYear,
      week: state.week,
      date: fmtDate()
    });
    player.careerHistory.transfers = player.careerHistory.transfers.slice(0, 40);
  }

  function trackClubMove({ type, fromClubId, toClubId, fee = 0, feeLabel = "", isLoan = false, parentClubId = null }) {
    const player = stateContainer.state.player;
    closeCurrentClubStint(player);
    recordCareerTransfer({ type, fromClubId, toClubId, fee, feeLabel });
    openClubStint(player, toClubId, { isLoan, parentClubId });
  }

  function normalizeCareerHistory(player, state) {
    if (!player.careerHistory) player.careerHistory = freshCareerHistory();
    if (!Array.isArray(player.careerHistory.transfers)) player.careerHistory.transfers = [];
    if (!Array.isArray(player.careerHistory.clubStints)) player.careerHistory.clubStints = [];

    const active = getActiveClubStint(player);
    if (!player.careerHistory.clubStints.length) {
      player.careerHistory.clubStints.push({
        clubId: player.clubId,
        fromSeasonYear: state?.seasonYear || 2026,
        fromWeek: 0,
        toSeasonYear: null,
        toWeek: null,
        appearances: Math.max(0, (player.careerStats?.appearances || 0) - (player.season?.appearances || 0)),
        goals: Math.max(0, (player.careerStats?.goals || 0) - (player.season?.goals || 0)),
        assists: Math.max(0, (player.careerStats?.assists || 0) - (player.season?.assists || 0)),
        isLoan: !!player.parentClubId,
        parentClubId: player.parentClubId || null
      });
      if (!player.careerHistory.transfers.length) {
        player.careerHistory.transfers.push({
          type: "join",
          fromClubId: null,
          toClubId: player.clubId,
          fee: 0,
          feeLabel: player.origin === "academy" ? "青训加盟" : "一线队加盟",
          seasonYear: state?.seasonYear || 2026,
          week: state?.week || 0,
          date: fmtCareerFullDate(state?.seasonYear || 2026, state?.week || 0).replace(/\./g, "-")
        });
      }
    } else if (active && active.clubId !== player.clubId) {
      closeCurrentClubStint(player, state);
      openClubStint(player, player.clubId, { isLoan: !!player.parentClubId, parentClubId: player.parentClubId });
    } else if (!active) {
      openClubStint(player, player.clubId, { isLoan: !!player.parentClubId, parentClubId: player.parentClubId });
    }
  }

  function contractExpiryLabel(player, state) {
    const expiry = new Date(state.seasonYear + player.contractYears, 5, 30);
    return `${expiry.getFullYear()}-${String(expiry.getMonth() + 1).padStart(2, "0")}-${String(expiry.getDate()).padStart(2, "0")}`;
  }

  function honorTierIcon(tier) {
    if (tier === "legend") return "🏆";
    if (tier === "gold") return "🥇";
    return "🎖️";
  }

  function placementLabel(leagueId, rank, total) {
    const rules = effectiveRules(leagueId);
    if (!rules) return "";
    if (rules.promotion && rank <= rules.promotion) return "升级";
    if (rules.playoffPromotion && rank <= rules.promotion + rules.playoffPromotion) return "升级附加赛";
    if (rules.ucl && rank <= rules.ucl) return "欧冠";
    if (rules.uclQ && rank <= rules.ucl + rules.uclQ) return "欧冠资格赛";
    const afterUcl = (rules.ucl || 0) + (rules.uclQ || 0);
    if (rules.uel && rank <= afterUcl + rules.uel) return "欧联";
    if (rules.uecl && rank <= afterUcl + (rules.uel || 0) + rules.uecl) return "欧协联";
    if (rules.playoff && rank === total - rules.relegation - rules.playoff + 1) return "保级附加赛";
    if (rules.relegation && rank > total - rules.relegation) return "降级区";
    return "";
  }

  function placementTagClass(label) {
    if (["欧冠", "欧冠资格赛", "升级"].includes(label)) return "green";
    if (["欧联", "欧协联", "升级附加赛", "保级附加赛"].includes(label)) return "gold";
    if (["降级区"].includes(label)) return "red";
    return "";
  }

  function createInitialState(form) {
    const origin = form.get("origin");
    const smallPool = CLUBS.filter((team) => team.tier === "small");
    const startingClub = origin === "academy" ? choice(eliteAcademyClubs()) : choice(smallPool);
    const baseOverall = origin === "academy" ? randomInt(60, 66) : randomInt(55, 62);
    const potential = randomInt(84, 97);
    const position = form.get("position");
    const attributes = createAttributes(position, baseOverall);
    const player = {
      name: form.get("playerName").trim() || choice(PLAYER_NAME_POOL),
      nationality: form.get("nationality"),
      position,
      age: 16,
      origin,
      clubId: startingClub.id,
      parentClubId: null,
      loanUntilSeasonYear: null,
      academyStatus: origin === "academy" ? "expiring" : "senior",
      role: origin === "academy" ? "青训合同到期" : "轮换",
      potential,
      attributes,
      overall: calculateOverall(attributes, position),
      xp: 0,
      value: 0,
      wage: 0,
      reputation: origin === "academy" ? randomInt(18, 28) : randomInt(10, 20),
      morale: 62,
      form: 0,
      fatigue: 16,
      contractYears: origin === "academy" ? 1 : 2,
      season: freshSeasonStats(),
      careerStats: freshCareerStats(),
      honors: [],
      national: normalizeNationalData(null),
      careerHistory: freshCareerHistory()
    };
    player.value = calculateValue(player);
    player.wage = calculateWage(player, startingClub);
    if (origin === "academy") {
      player.wage = randomInt(800, 2500);
    }
    return {
      version: 2,
      seed: seedFromTime(),
      seasonYear: 2026,
      week: 0,
      trainedThisWeek: false,
      player,
      agent: {
        name: choice(AGENTS)
      },
      attitudes: {
        manager: origin === "academy" ? 48 : 56,
        fans: origin === "academy" ? 42 : 50,
        board: 55,
        teammates: 52,
        agent: 62
      },
      windows: {
        summer: false,
        winter: false
      },
      market: {
        isOpen: false,
        windowType: null,
        strategy: "stay",
        offers: [],
        lastOfferWeek: null,
        dealDone: false
      },
      euroBonusLeagues: drawEuroBonusLeagues(),
      clubQualifications: {},
      european: null,
      leagues: {},
      logs: [],
      pendingChoice: null
    };
  }

  function startNewGame(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    stateContainer.state = createInitialState(form);
    ensureLeagueSeason(currentClub().league);
    refreshClubQualifications();
    ensureEuropeanCampaign();
    const state = stateContainer.state;
    recordCareerTransfer({
      type: "join",
      fromClubId: null,
      toClubId: state.player.clubId,
      fee: 0,
      feeLabel: state.player.origin === "academy" ? "青训加盟" : "一线队加盟"
    });
    openClubStint(state.player, state.player.clubId);
    addLog("positive", `${state.player.name}，16 岁，${state.player.nationality}${positionName(state.player.position)}，正式开启生涯。当前俱乐部：${currentClub().name}。`, "career");
    addLog("info", `经纪人${state.agent.name}与你签约：会通知俱乐部兴趣、报价和续约情况，但不能替你强行加盟任何球队。`, "agent");
    addLog("info", euroBonusSummary(), "table");
    createInitialAcademyNegotiation();
    saveGame(true);
    showGame();
    render();
  }

  function showGame() {
    $("#setupScreen").classList.add("hidden");
    $("#gameScreen").classList.remove("hidden");
  }

  function showSetup() {
    $("#gameScreen").classList.add("hidden");
    $("#setupScreen").classList.remove("hidden");
  }

  function render() {
    const state = stateContainer.state;
    if (!state) return;
    $("#seasonLabel").textContent = `${state.seasonYear}/${String(state.seasonYear + 1).slice(2)} 赛季 第 ${state.week + 1} 周`;
    $("#playerTitle").textContent = `${state.player.name} · ${currentClub().name}`;
    renderStatus();
    renderTabs();
    renderCareer();
    renderMatch();
    renderTable();
    renderMarket();
    renderCareerRecord();
    renderChoiceModal();
    window.__roadToKingState = state;
  }

  function renderStatus() {
    const state = stateContainer.state;
    const player = state.player;
    const parent = parentClub();
    const metrics = [
      ["能力", `${player.overall}`, `潜力 ${player.potential}`],
      ["位置", positionName(player.position), player.role],
      ["身价", money(player.value), wage(player.wage)],
      ["合同", `${player.contractYears} 年`, parent ? `租借自${parent.name}` : currentClub().name],
      ["状态", `士气 ${player.morale}`, `疲劳 ${player.fatigue}`],
      ["下场", nextOpponentLabel(), fmtDate()]
    ];
    $("#statusGrid").innerHTML = metrics
      .map(([label, value, sub]) => `<div class="metric"><span>${label}</span><strong>${escapeHtml(value)}</strong><span>${escapeHtml(sub)}</span></div>`)
      .join("");
  }

  function renderTabs() {
    if (["honors", "profile"].includes(stateContainer.activeTab)) stateContainer.activeTab = "record";
    $$(".tab").forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === stateContainer.activeTab);
    });
    $$(".view").forEach((view) => view.classList.add("hidden"));
    $(`#${stateContainer.activeTab}View`).classList.remove("hidden");
  }

  function renderCareer() {
    const state = stateContainer.state;
    const windowDue = isTransferWindowDue();
    const primaryLabel = windowDue ? "处理转会窗" : "开始下场比赛";
    const secondaryLabel = windowDue ? "转会窗后再比赛" : "跳过直接看赛果";
    const timelineCollapsed = stateContainer.careerTimelineCollapsed;
    const trainingNotice = trainingStatusNotice(state.player);
    $("#careerView").innerHTML = `
      <div class="two-column">
        <section class="log-panel ${timelineCollapsed ? "is-collapsed" : ""}">
          <div class="section-heading">
            <h3>生涯时间线</h3>
            <button class="ghost-button compact-button" type="button" data-action="toggle-career-timeline">
              ${timelineCollapsed ? "展开" : "折叠"}
            </button>
          </div>
          ${timelineCollapsed ? `<p class="small-note">时间线已折叠，点击展开查看事件。</p>` : renderLogs(state.logs)}
        </section>
        <aside class="action-panel">
          <h3>推进</h3>
          <div class="button-stack">
            <button class="primary-button" type="button" data-action="advance-detailed">${primaryLabel}</button>
            <button class="secondary-button" type="button" data-action="advance-skip" ${windowDue ? "disabled" : ""}>${secondaryLabel}</button>
            <button class="secondary-button" type="button" data-action="train-normal" ${state.trainedThisWeek ? "disabled" : ""}>常规训练</button>
            <button class="secondary-button" type="button" data-action="train-intense" ${state.trainedThisWeek ? "disabled" : ""}>强化训练</button>
            <button class="secondary-button" type="button" data-action="train-recovery" ${state.trainedThisWeek ? "disabled" : ""}>恢复训练</button>
          </div>
          <p class="training-notice ${trainingNotice.type}">${escapeHtml(trainingNotice.text)}</p>
          ${renderGrowthPanel()}
          <p class="small-note">训练每周只能做一次。比赛、报价、征召和媒体事件由规则结算，不能手动指定结果。</p>
        </aside>
      </div>
    `;
  }

  function renderGrowthPanel() {
    const player = stateContainer.state.player;
    const info = growthInfo(player);
    if (info.atCap) {
      return `
        <section class="growth-panel">
          <div class="section-heading compact-heading">
            <h3>成长进度</h3>
            <span class="tag gold">潜力上限</span>
          </div>
          <div class="growth-overall">
            <span>综合能力</span>
            <strong>${player.overall}</strong>
            <small>潜力 ${player.potential}</small>
          </div>
          <div class="growth-meter"><span style="width: 100%"></span></div>
          <p class="small-note">当前能力已到 ${player.potential} 潜力上限。继续训练和比赛会保留成长经验，赛季末突破潜力后才能继续转化。</p>
        </section>
      `;
    }
    return `
      <section class="growth-panel">
        <div class="section-heading compact-heading">
          <h3>成长进度</h3>
          <strong>${info.current}/${info.needed}</strong>
        </div>
        <div class="growth-overall">
          <span>综合能力</span>
          <strong>${player.overall}</strong>
          <small>潜力 ${player.potential}</small>
        </div>
        <div class="growth-meter"><span style="width: ${info.percent}%"></span></div>
        <div class="growth-grid">
          <div><span>还差</span><strong>${info.remaining}</strong></div>
          <div><span>常规训练</span><strong>${info.normalSessions} 次</strong></div>
          <div><span>强化训练</span><strong>${info.intenseSessions} 次</strong></div>
          <div><span>比赛预估</span><strong>${info.matchSessions} 场</strong></div>
        </div>
        <p class="small-note">满格后固定让 1 项属性 +1。高概率从${attributePriorityLabels(player.position)}中抽取，低概率从${growableAttributeLabels(player.position) || "位置相关属性"}中抽取；不会浪费在门将等与位置无关的属性上。综合能力按${positionName(player.position)}权重计算：${overallWeightLabels(player.position)}。</p>
      </section>
    `;
  }

  function renderLogs(logs) {
    if (!logs.length) return `<p class="small-note">还没有事件。</p>`;
    return logs
      .map(
        (entry) => `
          <article class="log-entry ${entry.type}">
            <time>${entry.date} · ${entry.tag}</time>
            <p>${escapeHtml(entry.text)}</p>
          </article>
        `
      )
      .join("");
  }

  function ensureEuropeanCampaign() {
    const state = stateContainer.state;
    const own = currentClub();
    if (LEAGUES[own.league]?.level !== 1) return;
    if (state.european?.clubId === own.id) {
      ensureEuropeanLeagueSchedule(state.european);
      if (state.european.phase === "league") resolveEuropeanLeaguePhase(state.european, state.week, true);
      return;
    }
    ensureLeagueSeason(own.league);
    const rows = sortedTable(own.league);
    const rank = rows.findIndex((row) => row.teamId === own.id) + 1;
    if (!rank) return;
    const qualification = placementLabel(own.league, rank, rows.length);
    const competition = europeanCompetitionForSeason(own.league, rank, qualification);
    if (!competition) return;
    setupEuropeanCampaign(competition, own.id);
    state.european.schedule.forEach((match) => {
      if (match.week < state.week && !match.played) {
        match.played = true;
        match.homeGoals = randomInt(0, 2);
        match.awayGoals = randomInt(0, 2);
      }
    });
    ensureEuropeanLeagueSchedule(state.european);
    resolveEuropeanLeaguePhase(state.european, state.week, true);
    if (state.european.schedule.some((match) => match.played && !state.european.won && !isEuropeanLeagueMatch(match))) {
      const lastPlayed = [...state.european.schedule].reverse().find((match) => match.played && !isEuropeanLeagueMatch(match));
      if (lastPlayed) {
        const ownGoals = lastPlayed.home === own.id ? lastPlayed.homeGoals : lastPlayed.awayGoals;
        const oppGoals = lastPlayed.home === own.id ? lastPlayed.awayGoals : lastPlayed.homeGoals;
        if (ownGoals < oppGoals) state.european.eliminated = true;
        if (lastPlayed.stage === "决赛" && ownGoals > oppGoals) state.european.won = true;
      }
    }
  }

  function renderLeaderboardBlock(title, rows, valueKey, valueLabel) {
    if (!rows.length) return "";
    return `
      <div class="leaderboard-block">
        <h4>${title}</h4>
        <div class="leaderboard-list">
          ${rows
            .slice(0, 10)
            .map((row, index) => {
              const value = row[valueKey];
              const display = valueKey === "rating" && typeof value === "number" ? value.toFixed(2) : value;
              return `
                <article class="leaderboard-row ${row.isUser ? "highlight" : ""}">
                  <span class="leaderboard-rank">${index + 1}</span>
                  <div class="leaderboard-player">
                    <strong>${escapeHtml(row.name)}</strong>
                    <small>${escapeHtml(row.team)}</small>
                  </div>
                  <div class="leaderboard-value">
                    <strong>${display}</strong>
                    <span>${valueLabel}</span>
                  </div>
                </article>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  function europeanParticipants(euro) {
    if (!euro) return [];
    return Array.from(new Set([...(euro.participants || []), euro.clubId, ...euro.schedule.flatMap((match) => [match.home, match.away])].filter(Boolean)));
  }

  function buildEuropeanStandings(euro) {
    const state = stateContainer.state;
    const rows = europeanParticipants(euro).map((teamId) => ({
      teamId,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0
    }));
    const rowFor = (teamId) => rows.find((row) => row.teamId === teamId);
    const applyResult = (homeId, awayId, homeGoals, awayGoals) => {
      const home = rowFor(homeId);
      const away = rowFor(awayId);
      if (!home || !away) return;
      home.played += 1;
      away.played += 1;
      home.gf += homeGoals;
      home.ga += awayGoals;
      away.gf += awayGoals;
      away.ga += homeGoals;
      if (homeGoals > awayGoals) {
        home.won += 1;
        away.lost += 1;
        home.points += 3;
      } else if (homeGoals < awayGoals) {
        away.won += 1;
        home.lost += 1;
        away.points += 3;
      } else {
        home.drawn += 1;
        away.drawn += 1;
        home.points += 1;
        away.points += 1;
      }
    };

    euro.schedule
      .filter((match) => match.played && isEuropeanLeagueMatch(match))
      .forEach((match) => applyResult(match.home, match.away, match.homeGoals, match.awayGoals));

    const matchCount = europeanLeagueMatchCount(euro.competition);
    const playedLeagueRounds = euro.schedule.filter((match) => match.played && isEuropeanLeagueMatch(match)).length;
    rows.forEach((row) => {
      const team = club(row.teamId);
      const targetPlayed = Math.min(matchCount, Math.max(row.played, playedLeagueRounds, Math.floor((state.week + 2) / 4)));
      while (row.played < targetPlayed) {
        const seed = (euro.standingsSeed || 0) + row.teamId.length * 17 + row.played * 23 + state.seasonYear;
        const gf = Math.max(0, Math.round(0.7 + (team.rating - 70) / 18 + pseudoRandom(seed) * 2.4));
        const ga = Math.max(0, Math.round(0.6 + pseudoRandom(seed + 9) * 2.2));
        row.played += 1;
        row.gf += gf;
        row.ga += ga;
        if (gf > ga) {
          row.won += 1;
          row.points += 3;
        } else if (gf < ga) {
          row.lost += 1;
        } else {
          row.drawn += 1;
          row.points += 1;
        }
      }
      row.gd = row.gf - row.ga;
    });

    return rows.sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf || club(b.teamId).rating - club(a.teamId).rating);
  }

  function buildEuropeanLeaderboards(euro) {
    const standings = buildEuropeanStandings(euro);
    const scorers = [];
    const assisters = [];
    const ratings = [];
    standings.forEach((row) => {
      const team = club(row.teamId);
      const seed = (euro.standingsSeed || 0) + row.teamId.length * 29 + stateContainer.state.seasonYear;
      const userClub = row.teamId === euro.clubId;
      const teamGoals = Math.max(0, row.gf - (userClub ? euro.stats.goals : 0));
      const teamAssists = Math.max(0, Math.round(row.gf * 0.72) - (userClub ? euro.stats.assists : 0));
      const goals = Math.max(0, Math.min(teamGoals, Math.round(teamGoals * (0.38 + pseudoRandom(seed) * 0.2))));
      const assists = Math.max(0, Math.min(teamAssists, Math.round(teamAssists * (0.34 + pseudoRandom(seed + 13) * 0.18))));
      const rating = clamp(6.2 + (team.rating - 72) * 0.04 + pseudoRandom(seed + 31) * 0.62, 5.9, 8.0);
      scorers.push({ name: generatedPlayerName(team, "euro-scorer", seed), team: team.name, goals, isUser: false });
      assisters.push({ name: generatedPlayerName(team, "euro-creator", seed + 13), team: team.name, assists, isUser: false });
      ratings.push({ name: generatedPlayerName(team, "euro-star", seed + 31), team: team.name, rating, isUser: false });
    });

    if (euro.stats.appearances > 0) {
      const player = stateContainer.state.player;
      const avgRating = euro.stats.ratedMatches ? euro.stats.ratingTotal / euro.stats.ratedMatches : 0;
      scorers.push({ name: player.name, team: currentClub().name, goals: euro.stats.goals, isUser: true });
      assisters.push({ name: player.name, team: currentClub().name, assists: euro.stats.assists, isUser: true });
      if (avgRating > 0) ratings.push({ name: player.name, team: currentClub().name, rating: avgRating, isUser: true });
    }

    scorers.sort((a, b) => b.goals - a.goals || Number(b.isUser) - Number(a.isUser));
    assisters.sort((a, b) => b.assists - a.assists || Number(b.isUser) - Number(a.isUser));
    ratings.sort((a, b) => b.rating - a.rating || Number(b.isUser) - Number(a.isUser));
    return {
      scorers: scorers.slice(0, 12),
      assisters: assisters.slice(0, 12),
      ratings: ratings.slice(0, 12)
    };
  }

  function renderEuropeanCompetitionPanel(state, own) {
    const euro = state.european;
    if (!euro || euro.clubId !== own.id) {
      return `
        <section class="section">
          <h3>欧战</h3>
          <p class="small-note">本赛季暂未进入欧战。拿到欧冠、欧联或欧协联资格后，这里会显示欧战积分榜、晋级图和球员榜。</p>
        </section>
      `;
    }
    const standings = buildEuropeanStandings(euro);
    const boards = buildEuropeanLeaderboards(euro);
    const knockoutMatches = euro.schedule.filter((match) => !isEuropeanLeagueMatch(match));
    const stageNote = euro.phase === "league"
      ? `联赛阶段进行中：前 8 名直接进入 16 强，第 9-24 名进入淘汰赛附加赛。${euro.competition === "欧协联" ? "欧协联为 6 场联赛阶段。" : "欧冠/欧联为 8 场联赛阶段。"}`
      : euro.won
        ? `${euro.competition}已经夺冠。`
        : euro.eliminated
          ? `${euro.competition}征程已经结束。`
          : `当前阶段：${euro.currentRound || "淘汰赛"}。`;
    return `
      <section class="section">
        <h3>${euro.competition} 积分榜</h3>
        <p class="small-note">${stageNote}</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>球队</th>
                <th>赛</th>
                <th>胜</th>
                <th>平</th>
                <th>负</th>
                <th>进</th>
                <th>失</th>
                <th>净</th>
                <th>分</th>
              </tr>
            </thead>
            <tbody>
              ${standings
                .map(
                  (row, index) => `
                    <tr class="${row.teamId === own.id ? "highlight" : ""}">
                      <td>${index + 1}</td>
                      <td>${escapeHtml(club(row.teamId).name)}</td>
                      <td>${row.played}</td>
                      <td>${row.won}</td>
                      <td>${row.drawn}</td>
                      <td>${row.lost}</td>
                      <td>${row.gf}</td>
                      <td>${row.ga}</td>
                      <td>${row.gd}</td>
                      <td><strong>${row.points}</strong></td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </section>
      <section class="section">
        <h3>${euro.competition} 晋级图</h3>
        <div class="euro-bracket">
          ${
            knockoutMatches.length
              ? knockoutMatches
            .map((match) => {
              const isHome = match.home === own.id;
              const opponent = club(isHome ? match.away : match.home);
              const result = match.played ? `${match.homeGoals}-${match.awayGoals}` : `第 ${match.week + 1} 周`;
              return `
                <article class="euro-bracket-node ${match.played ? "played" : match.week === state.week ? "current" : ""}">
                  <strong>${match.stage}</strong>
                  <span>${isHome ? "主场" : "客场"} vs ${escapeHtml(opponent.name)}</span>
                  <b>${result}</b>
                </article>
              `;
            })
            .join("")
              : `<p class="small-note">联赛阶段尚未结束，淘汰赛附加赛、16 强、8 强、半决赛和决赛会在确认晋级后逐轮生成。</p>`
          }
        </div>
      </section>
      <section class="section">
        <h3>${euro.competition} 球员榜</h3>
        <div class="leaderboards-grid">
          ${renderLeaderboardBlock("进球榜", boards.scorers, "goals", "进球")}
          ${renderLeaderboardBlock("助攻榜", boards.assisters, "assists", "助攻")}
          ${renderLeaderboardBlock("评分榜", boards.ratings, "rating", "均分")}
        </div>
      </section>
    `;
  }

  function renderEuropeanPanel(state, own) {
    const euro = state.european;
    if (!euro || euro.clubId !== own.id) return "";
    const stats = euro.stats;
    const avgEuro = stats.ratedMatches ? (stats.ratingTotal / stats.ratedMatches).toFixed(2) : "无";
    const status = euro.won ? "已夺冠" : euro.eliminated ? "已淘汰" : "进行中";
    const nextEuro = getNextEuropeanMatch();
    const leagueProgress = `${euro.schedule.filter((match) => match.played && isEuropeanLeagueMatch(match)).length}/${europeanLeagueMatchCount(euro.competition)}`;
    const scheduleRows = euro.schedule
      .map((match) => {
        const isHome = match.home === own.id;
        const opponent = club(isHome ? match.away : match.home);
        const result = match.played ? `${match.homeGoals}-${match.awayGoals}` : `第 ${match.week + 1} 周`;
        const rowClass = match.played ? "" : match.week === state.week ? "highlight" : "";
        return `
          <tr class="${rowClass}">
            <td>${match.stage}</td>
            <td>${isHome ? "主场" : "客场"} vs ${escapeHtml(opponent.name)}</td>
            <td>${result}</td>
          </tr>
        `;
      })
      .join("");
    return `
      <section class="section">
        <div class="section-heading">
          <h3>${euro.competition} · ${status}</h3>
          ${nextEuro ? `<span class="tag gold">下场 ${nextEuro.stage}</span>` : ""}
        </div>
        <div class="match-line"><span>你的欧战数据</span><strong>${stats.appearances} 场 ${stats.goals} 球 ${stats.assists} 助攻 · 均分 ${avgEuro}</strong></div>
        <p class="small-note">欧战有额外成长加成，联赛阶段进度 ${leagueProgress}；淘汰赛会在排名或晋级确认后逐轮生成。</p>
        <div class="table-wrap compact">
          <table class="mini-table">
            <thead>
              <tr>
                <th>阶段</th>
                <th>对阵</th>
                <th>赛果/时间</th>
              </tr>
            </thead>
            <tbody>${scheduleRows}</tbody>
          </table>
        </div>
      </section>
    `;
  }

  function renderNationalPanel(player) {
    const national = player.national;
    const season = national.season || { caps: 0, goals: 0, assists: 0 };
    const recentMatches = national.matches
      .slice(0, 6)
      .map(
        (match) => `
          <article class="mini-log">
            <strong>${escapeHtml(match.result)}</strong>
            <span>${match.date} · ${match.minutes} 分钟 · 评分 ${match.rating.toFixed(1)}${match.goals ? ` · ${match.goals} 球` : ""}${match.assists ? ` · ${match.assists} 助攻` : ""}</span>
          </article>
        `
      )
      .join("");
    return `
      <section class="section">
        <h3>国家队</h3>
        <div class="match-line"><span>生涯</span><strong>${national.caps} 场 · ${national.goals} 球 · ${national.assists} 助攻 · ${national.callUps} 次征召</strong></div>
        <div class="match-line"><span>本季</span><strong>${season.caps} 场 · ${season.goals} 球 · ${season.assists} 助攻</strong></div>
        <div class="mini-log-list">
          ${recentMatches || `<p class="small-note">暂无国家队比赛记录，国际比赛日（第 8/15/25/32 周）有机会入选。</p>`}
        </div>
      </section>
    `;
  }

  function renderMatch() {
    const state = stateContainer.state;
    const windowDue = isTransferWindowDue();
    const match = getNextMatch();
    const own = currentClub();
    const opponent = match ? club(match.home === own.id ? match.away : match.home) : null;
    const averageRating = state.player.season.ratedMatches ? (state.player.season.ratingTotal / state.player.season.ratedMatches).toFixed(2) : "无";
    const competitionLabel =
      match?.type === "european"
        ? `${state.european?.competition || "欧战"} · ${match.stage || ""}`
        : LEAGUES[own.league].name;
    $("#matchView").innerHTML = `
      <div class="match-layout">
        <div class="two-column">
          <section class="section match-card">
            <h3>下一场</h3>
            ${
              match
                ? `
                  <div class="match-line"><span>赛事</span><strong>${competitionLabel}</strong></div>
                  <div class="match-line"><span>对手</span><strong>${match.home === own.id ? "主场" : "客场"} vs ${opponent.name}</strong></div>
                  <div class="match-line"><span>对手评级</span><strong>${opponent.rating}</strong></div>
                  <div class="match-line"><span>你的角色</span><strong>${state.player.role}</strong></div>
                `
                : `<p class="small-note">本周没有正式比赛，推进后会进入训练、国家队或赛季结算。</p>`
            }
            <div class="action-grid">
              <button class="primary-button" type="button" data-action="advance-detailed">${windowDue ? "先处理转会窗" : "文字播报"}</button>
              <button class="secondary-button" type="button" data-action="advance-skip" ${windowDue ? "disabled" : ""}>直接赛果</button>
            </div>
          </section>
          <section class="section">
            <h3>联赛赛季数据</h3>
            <div class="match-line"><span>出场</span><strong>${state.player.season.appearances}</strong></div>
            <div class="match-line"><span>进球</span><strong>${state.player.season.goals}</strong></div>
            <div class="match-line"><span>助攻</span><strong>${state.player.season.assists}</strong></div>
            <div class="match-line"><span>场均评分</span><strong>${averageRating}</strong></div>
          </section>
        </div>
        ${renderEuropeanPanel(state, own)}
        ${renderNationalPanel(state.player)}
      </div>
    `;
  }

  function renderTable() {
    const state = stateContainer.state;
    const leagueId = currentClub().league;
    const rules = effectiveRules(leagueId);
    const rows = sortedTable(leagueId);
    const boards = buildLeagueLeaderboards(leagueId);
    $("#tableView").innerHTML = `
      <section class="section">
        <h3>${rules.name} 积分榜</h3>
        <p class="small-note">${leagueRuleNote(leagueId)}</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>球队</th>
                <th>资格</th>
                <th>赛</th>
                <th>胜</th>
                <th>平</th>
                <th>负</th>
                <th>进</th>
                <th>失</th>
                <th>净</th>
                <th>分</th>
              </tr>
            </thead>
            <tbody>
              ${rows
                .map((row, index) => {
                  const label = placementLabel(leagueId, index + 1, rows.length);
                  return `
                    <tr class="${row.teamId === state.player.clubId ? "highlight" : ""}">
                      <td>${index + 1}</td>
                      <td>${club(row.teamId).name}</td>
                      <td>${label ? `<span class="tag ${placementTagClass(label)}">${label}</span>` : ""}</td>
                      <td>${row.played}</td>
                      <td>${row.won}</td>
                      <td>${row.drawn}</td>
                      <td>${row.lost}</td>
                      <td>${row.gf}</td>
                      <td>${row.ga}</td>
                      <td>${row.gd}</td>
                      <td><strong>${row.points}</strong></td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </section>
      <section class="section">
        <h3>球员榜</h3>
        <p class="small-note">联赛射手榜、助攻榜与评分榜；你在榜中会高亮显示。</p>
        <div class="leaderboards-grid">
          ${renderLeaderboardBlock("进球榜", boards.scorers, "goals", "进球")}
          ${renderLeaderboardBlock("助攻榜", boards.assisters, "assists", "助攻")}
          ${renderLeaderboardBlock("评分榜", boards.ratings, "rating", "均分")}
        </div>
      </section>
      ${renderEuropeanCompetitionPanel(state, currentClub())}
    `;
  }

  function renderMarket() {
    const state = stateContainer.state;
    if (state.market.strategy === "leave") state.market.strategy = "transfer";
    const loanDisabled = state.player.parentClubId ? "disabled" : "";
    const strategyLabels = {
      stay: "保持现状",
      minutes: "优先出场时间",
      bigger: "寻找更大舞台",
      loan: "寻求外租",
      transfer: "寻求转会"
    };
    $("#marketView").innerHTML = `
      <div class="two-column">
        <section class="section">
          <h3>经纪人办公室</h3>
          <p class="small-note">经纪人：${state.agent.name}。当前策略：${strategyLabels[state.market.strategy]}。</p>
          <div class="action-grid">
            <button class="secondary-button" type="button" data-strategy="stay">保持现状</button>
            <button class="secondary-button" type="button" data-strategy="minutes">寻找出场时间</button>
            <button class="secondary-button" type="button" data-strategy="bigger">推荐给更大俱乐部</button>
            <button class="secondary-button" type="button" data-strategy="loan" ${loanDisabled}>寻求外租</button>
            <button class="danger-button" type="button" data-strategy="transfer">寻求转会</button>
          </div>
          <p class="small-note">外租会保留母队合同并在赛季末回归；转会会永久更换俱乐部、合同和薪水。「推荐给更大俱乐部」会综合你的能力、潜力与当前俱乐部层级，只向声望/实力真正高一档的球队询价。</p>
        </section>
        <section class="section offer-panel ${stateContainer.marketOffersCollapsed ? "is-collapsed" : ""}">
          <div class="section-heading">
            <h3>正式报价</h3>
            <button class="ghost-button compact-button" type="button" data-action="toggle-market-offers">
              ${stateContainer.marketOffersCollapsed ? "展开" : "折叠"}
            </button>
          </div>
          ${
            stateContainer.marketOffersCollapsed
              ? `<p class="small-note">报价列表已折叠。${state.market.dealDone ? "本窗口已完成操作，不再接收新报价。" : `待回应 ${state.market.offers.filter((offer) => offer.status === "open").length} 条。`}</p>`
              : `<div class="offer-list">${renderOffers()}</div>`
          }
        </section>
      </div>
    `;
  }

  function renderOfferCard(offer, index) {
    const target = club(offer.clubId);
    const offerTitle = offer.kind === "academyPoach" ? `${target.name}梯队挖角` : offer.kind === "seniorLoan" ? `${target.name}租借邀请` : target.name;
    const detail =
      offer.kind === "seniorLoan"
        ? `${LEAGUES[target.league].name} · 租借费 ${money(offer.fee)} · 承担薪水 ${offer.wageShare}% · 至赛季末 · ${offer.role === "租借主力" ? "承诺主力" : "轮换培养"}`
        : `${LEAGUES[target.league].name} · ${offer.kind === "academyPoach" ? "培养补偿" : "转会费"} ${money(offer.fee)} · ${wage(offer.wage)} · ${offer.years} 年 · 定位 ${offer.role}`;
    const openLabel = offer.kind === "seniorLoan" ? "同意外租" : "同意个人条款";
    const statusLabel =
      offer.status === "open"
        ? openLabel
        : offer.status === "accepted"
          ? "已接受"
          : offer.status === "declined"
            ? "你已拒绝"
            : offer.status === "expired"
              ? "已失效"
              : "母队已拒绝";
    const euroLabel = clubEuropeanProspectLabel(offer.clubId);
    const euroTag = euroLabel ? `<span class="tag ${placementTagClass(euroLabel)}">${euroLabel}</span>` : "";
    const cardClass = offer.status === "accepted" ? "offer-card accepted" : offer.status === "open" ? "offer-card" : "offer-card muted";
    return `
      <article class="${cardClass}">
        <h4>${offerTitle} ${euroTag}</h4>
        <p>${detail}${euroLabel ? ` · 下赛季预计参加${euroLabel}` : ""}</p>
        <div class="offer-actions">
          <button class="primary-button" type="button" data-offer="${index}" ${offer.status !== "open" ? "disabled" : ""}>
            ${statusLabel}
          </button>
          <button class="ghost-button" type="button" data-offer-reject="${index}" ${offer.status !== "open" ? "disabled" : ""}>
            拒绝
          </button>
        </div>
      </article>
    `;
  }

  function renderOffers() {
    const state = stateContainer.state;
    const offers = state.market.offers || [];
    if (!offers.length) return `<p class="small-note">暂时没有正式报价。</p>`;

    const pending = offers.map((offer, index) => ({ offer, index })).filter(({ offer }) => offer.status === "open");
    const rejected = offers
      .map((offer, index) => ({ offer, index }))
      .filter(({ offer }) => ["declined", "rejected", "expired"].includes(offer.status));
    const accepted = offers.map((offer, index) => ({ offer, index })).filter(({ offer }) => offer.status === "accepted");

    const pendingHtml = pending.length
      ? pending.map(({ offer, index }) => renderOfferCard(offer, index)).join("")
      : `<p class="small-note">暂无待回应报价。</p>`;
    const rejectedHtml = rejected.length
      ? rejected.map(({ offer, index }) => renderOfferCard(offer, index)).join("")
      : `<p class="small-note">暂无已拒绝或失效报价。</p>`;
    const acceptedHtml = accepted.length
      ? `<div class="offer-accepted-banner">${accepted.map(({ offer, index }) => renderOfferCard(offer, index)).join("")}</div>`
      : "";

    return `
      ${state.market.dealDone ? `<p class="small-note offer-notice">本窗口已完成转会/租借，不再接收新报价。</p>` : ""}
      ${acceptedHtml}
      <div class="offer-columns">
        <div class="offer-column">
          <div class="offer-column-heading">
            <h4>待回应</h4>
            <span class="tag green">${pending.length}</span>
          </div>
          ${pendingHtml}
        </div>
        <div class="offer-column">
          <div class="offer-column-heading">
            <h4>已拒绝 / 失效</h4>
            <span class="tag">${rejected.length}</span>
          </div>
          ${rejectedHtml}
        </div>
      </div>
    `;
  }

  function honorCategoryLabel(category) {
    return {
      personal: "个人",
      club: "俱乐部",
      continental: "洲际",
      international: "国家队"
    }[category] || "荣誉";
  }

  function renderCareerRecord() {
    const state = stateContainer.state;
    const player = state.player;
    normalizeCareerHistory(player, state);
    const honors = player.honors || [];
    const stats = player.careerStats || freshCareerStats();
    const own = currentClub();
    const parent = parentClub();
    const activeStint = getActiveClubStint(player);
    const displayStints = (player.careerHistory?.clubStints || [])
      .slice()
      .reverse()
      .map((stint) => {
        const live =
          stint === activeStint
            ? {
                appearances: stint.appearances + player.season.appearances,
                goals: stint.goals + player.season.goals,
                assists: stint.assists + player.season.assists
              }
            : {
                appearances: stint.appearances,
                goals: stint.goals,
                assists: stint.assists
              };
        return { stint, ...live };
      });
    const transfers = player.careerHistory?.transfers || [];
    const national = player.national;
    const debutMatch = national.matches.length ? national.matches[national.matches.length - 1] : null;
    const sortedHonors = sortHonorsForRecord(honors, stateContainer.honorSort);

    $("#recordView").innerHTML = `
      <div class="record-page">
        <section class="record-hero">
          <div class="record-hero-main">
            <h3>${escapeHtml(player.name)}</h3>
            <p>${escapeHtml(player.nationality)} · ${positionName(player.position)} · ${player.age} 岁</p>
          </div>
          <div class="record-hero-stats">
            <div><span>能力</span><strong>${player.overall}</strong></div>
            <div><span>潜力</span><strong>${player.potential}</strong></div>
            <div><span>身价</span><strong>${money(player.value)}</strong></div>
            <div><span>周薪</span><strong>${wage(player.wage)}</strong></div>
          </div>
        </section>

        <section class="record-block">
          <h4 class="record-block-title">基本资料</h4>
          <div class="record-kv-list">
            <div class="record-kv"><span>姓名</span><strong>${escapeHtml(player.name)}</strong></div>
            <div class="record-kv"><span>国籍</span><strong>${escapeHtml(player.nationality)}</strong></div>
            <div class="record-kv"><span>位置</span><strong>${positionName(player.position)}</strong></div>
            <div class="record-kv"><span>俱乐部</span><strong>${escapeHtml(own.name)}${parent ? `（租借自${parent.name}）` : ""}</strong></div>
            <div class="record-kv"><span>角色</span><strong>${escapeHtml(player.role)}</strong></div>
            <div class="record-kv"><span>合同到期</span><strong>${contractExpiryLabel(player, state)}</strong></div>
            <div class="record-kv"><span>周薪</span><strong>${wage(player.wage)}</strong></div>
            <div class="record-kv"><span>声望</span><strong>${Math.round(player.reputation)}</strong></div>
            <div class="record-kv"><span>生涯总计</span><strong>${stats.appearances} 场 ${stats.goals} 球 ${stats.assists} 助攻</strong></div>
          </div>
        </section>

        <section class="record-block">
          <h4 class="record-block-title">能力值</h4>
          <div class="bars record-bars">
            ${Object.entries(player.attributes)
              .filter(([key]) => (OVERALL_WEIGHTS[player.position] || OVERALL_WEIGHTS.CM)[key] > 0)
              .map(([key, value]) => renderBar(attributeLabel(key), value))
              .join("")}
          </div>
        </section>

        <section class="record-block">
          <h4 class="record-block-title">转会记录</h4>
          ${renderTransferHistory(transfers)}
        </section>

        <section class="record-block">
          <div class="record-block-heading">
            <h4 class="record-block-title">俱乐部生涯</h4>
            <div class="record-table-labels"><span>出场</span><span>进球</span><span>助攻</span></div>
          </div>
          ${renderClubCareerList(displayStints)}
        </section>

        <section class="record-block">
          <div class="record-block-heading">
            <h4 class="record-block-title">国家/地区队生涯</h4>
            <div class="record-table-labels"><span>出场</span><span>进球</span><span>助攻</span></div>
          </div>
          ${renderNationalCareerRow(player, debutMatch)}
        </section>

        <section class="record-block">
          <div class="record-block-heading">
            <h4 class="record-block-title">荣誉记录</h4>
            <div class="record-sort-tabs">
              <button class="record-sort ${stateContainer.honorSort === "competition" ? "active" : ""}" type="button" data-action="honor-sort" data-sort="competition">按赛事</button>
              <button class="record-sort ${stateContainer.honorSort === "time" ? "active" : ""}" type="button" data-action="honor-sort" data-sort="time">按时间</button>
            </div>
          </div>
          <div class="record-honor-summary">
            <span>奖杯 ${stats.trophies}</span>
            <span>个人奖 ${stats.personalAwards}</span>
            <span>欧冠进球 ${stats.uclGoals}</span>
          </div>
          ${renderRecordHonorList(sortedHonors)}
        </section>

        <section class="record-block">
          <h4 class="record-block-title">关系与存档</h4>
          <div class="bars record-bars">
            ${renderBar("主帅", state.attitudes.manager)}
            ${renderBar("球迷", state.attitudes.fans)}
            ${renderBar("董事会", state.attitudes.board)}
            ${renderBar("队友", state.attitudes.teammates)}
            ${renderBar("经纪人", state.attitudes.agent)}
          </div>
          <div class="button-stack record-save-actions">
            <button class="secondary-button" type="button" data-action="export-save">导出存档</button>
            <button class="secondary-button" type="button" data-action="import-save">导入存档</button>
            <button class="danger-button" type="button" data-action="reset-save">重新开档</button>
          </div>
        </section>
      </div>
    `;
  }

  function sortHonorsForRecord(honors, mode) {
    const list = honors.slice();
    if (mode === "competition") {
      list.sort((a, b) => {
        const compA = a.meta?.competition || honorCategoryLabel(a.category);
        const compB = b.meta?.competition || honorCategoryLabel(b.category);
        return compA.localeCompare(compB, "zh-CN") || (b.seasonYear || 0) - (a.seasonYear || 0);
      });
      return list;
    }
    return list;
  }

  function transferTypeLabel(type) {
    return {
      join: "加盟",
      transfer: "转会",
      loan: "租借",
      loanReturn: "租借回归",
      free: "自由身"
    }[type] || "转会";
  }

  function renderTransferHistory(transfers) {
    if (!transfers.length) return `<p class="small-note">暂无转会记录。</p>`;
    return `<div class="record-transfer-list">${transfers
      .map((move) => {
        const when = fmtCareerDotDate(move.seasonYear, move.week);
        const feeText =
          move.feeLabel ||
          (move.type === "loan" || move.type === "loanReturn"
            ? transferTypeLabel(move.type)
            : move.fee > 0
              ? money(move.fee)
              : transferTypeLabel(move.type));
        const fromClub = move.fromClubId ? club(move.fromClubId) : null;
        const toClub = club(move.toClubId);
        const route = fromClub
          ? `<span class="record-transfer-route">${escapeHtml(fromClub.name)} <span class="record-arrow">→</span> ${escapeHtml(toClub.name)}</span>`
          : `<span class="record-transfer-route">${escapeHtml(toClub.name)}</span>`;
        return `
          <article class="record-transfer-item">
            <div class="record-transfer-meta">
              <strong>${when}</strong>
              <span>${escapeHtml(feeText)}</span>
            </div>
            ${route}
          </article>
        `;
      })
      .join("")}</div>`;
  }

  function renderClubCareerList(stints) {
    if (!stints.length) return `<p class="small-note">暂无俱乐部生涯数据。</p>`;
    return `<div class="record-career-list">${stints
      .map(({ stint, appearances, goals, assists }) => {
        const team = club(stint.clubId);
        const loanTag = stint.isLoan ? `<span class="tag gold">外租</span>` : "";
        return `
          <article class="record-career-item">
            <div class="record-career-main">
              <div>
                <strong>${escapeHtml(team.name)} ${loanTag}</strong>
                <span>${fmtStintRange(stint)}</span>
              </div>
            </div>
            <div class="record-career-stats">
              <strong>${appearances}</strong>
              <strong>${goals}</strong>
              <strong>${assists}</strong>
            </div>
          </article>
        `;
      })
      .join("")}</div>`;
  }

  function renderNationalCareerRow(player, debutMatch) {
    const national = player.national;
    const debutText = debutMatch ? `首秀 ${debutMatch.date}` : "尚未首秀";
    return `
      <article class="record-career-item">
        <div class="record-career-main">
          <div>
            <strong>${escapeHtml(player.nationality)}</strong>
            <span>${debutText}</span>
          </div>
        </div>
        <div class="record-career-stats">
          <strong>${national.caps}</strong>
          <strong>${national.goals}</strong>
          <strong>${national.assists}</strong>
        </div>
      </article>
    `;
  }

  function renderRecordHonorList(honors) {
    if (!honors.length) {
      return `<p class="small-note">还没有正式荣誉。赛季末会根据联赛、欧战和国家队大赛结算。</p>`;
    }
    if (stateContainer.honorSort === "competition") {
      const groups = [];
      honors.forEach((honor) => {
        const key = honor.meta?.competition || honorCategoryLabel(honor.category);
        let group = groups.find((entry) => entry.key === key);
        if (!group) {
          group = { key, items: [] };
          groups.push(group);
        }
        group.items.push(honor);
      });
      return groups
        .map(
          (group) => `
            <div class="record-honor-group">
              <h5>${escapeHtml(group.key)}</h5>
              <div class="record-honor-list grouped">
                ${groupHonorsForRecord(group.items).map((awardGroup) => renderRecordHonorAwardGroup(awardGroup, true)).join("")}
              </div>
            </div>
          `
        )
        .join("");
    }
    return `<div class="record-honor-list grouped">${groupHonorsForRecord(honors).map((group) => renderRecordHonorAwardGroup(group)).join("")}</div>`;
  }

  function groupHonorsForRecord(honors) {
    const groups = [];
    honors.forEach((honor) => {
      const competition = honor.meta?.competition || honorCategoryLabel(honor.category);
      const key = `${honor.title}|${competition}`;
      let group = groups.find((entry) => entry.key === key);
      if (!group) {
        group = {
          key,
          title: honor.title,
          competition,
          tier: honor.tier || "standard",
          latestSeason: honor.seasonYear || 0,
          items: []
        };
        groups.push(group);
      }
      group.items.push(honor);
      group.latestSeason = Math.max(group.latestSeason, honor.seasonYear || 0);
      if (honor.tier === "legend" || (honor.tier === "gold" && group.tier !== "legend")) {
        group.tier = honor.tier;
      }
    });

    groups.forEach((group) => {
      group.items.sort((a, b) => (b.seasonYear || 0) - (a.seasonYear || 0) || (b.meta?.year || 0) - (a.meta?.year || 0));
    });

    return groups.sort((a, b) => b.latestSeason - a.latestSeason || a.title.localeCompare(b.title, "zh-CN"));
  }

  function renderRecordHonorAwardGroup(group, hideCompetition = false) {
    return `
      <article class="record-honor-award ${group.tier || ""}">
        <div class="record-honor-award-heading">
          <div>
            <strong>${escapeHtml(group.title)}</strong>
            ${hideCompetition ? "" : `<span>${escapeHtml(group.competition)}</span>`}
          </div>
          <b>${group.items.length} 个</b>
        </div>
        <div class="record-honor-trophy-grid">
          ${group.items.map((honor) => renderRecordHonorTrophy(honor)).join("")}
        </div>
      </article>
    `;
  }

  function renderRecordHonorTrophy(honor) {
    const competition = honor.meta?.competition || honorCategoryLabel(honor.category);
    const date = honor.meta?.year ? String(honor.meta.year) : honor.date || "";
    const detail = honorTrophyDetail(honor, competition);
    return `
      <div class="record-honor-trophy ${honor.tier || ""}" title="${escapeHtml(honor.subtitle || "")}">
        <div class="record-honor-icon">${honorTierIcon(honor.tier)}</div>
        <strong>${escapeHtml(date)}</strong>
        <span>${escapeHtml(detail)}</span>
      </div>
    `;
  }

  function honorTrophyDetail(honor, competition) {
    if (typeof honor.meta?.goals === "number") return `${honor.meta.goals} 球`;
    if (typeof honor.meta?.cleanSheets === "number") return `${honor.meta.cleanSheets} 零封`;
    if (typeof honor.meta?.score === "number") return `${honor.meta.score} 分`;
    const subject = (honor.subtitle || "").match(/^(.{1,12}?)(?:以|在|拿到|通过)/);
    if (subject?.[1] && subject[1] !== "你") return subject[1];
    return competition;
  }

  function renderBar(label, value, inverse = false) {
    const rounded = Math.round(value);
    const colorClass = inverse ? (rounded > 72 ? "red" : rounded > 48 ? "gold" : "") : rounded < 35 ? "red" : rounded < 58 ? "gold" : "";
    return `
      <div class="bar-row">
        <span>${label}</span>
        <div class="bar-track"><div class="bar-fill ${colorClass}" style="width: ${clamp(rounded, 0, 100)}%"></div></div>
        <strong>${rounded}</strong>
      </div>
    `;
  }

  function renderChoiceModal() {
    const state = stateContainer.state;
    const modal = $("#choiceModal");
    if (!state.pendingChoice) {
      modal.classList.add("hidden");
      modal.innerHTML = "";
      return;
    }
    modal.classList.remove("hidden");
    modal.innerHTML = `
      <div class="choice-box">
        <h3>${state.pendingChoice.title}</h3>
        <p>${escapeHtml(state.pendingChoice.prompt)}</p>
        ${state.pendingChoice.choices
          .map(
            (choiceItem, index) => `<button class="choice-button" type="button" data-choice="${index}">
              <span class="choice-button-label">${escapeHtml(choiceItem.label)}</span>
              <span class="choice-button-effects">${escapeHtml(formatChoiceEffects(choiceItem.effects, true))}</span>
            </button>`
          )
          .join("")}
      </div>
    `;
  }

  function exportSave() {
    const text = JSON.stringify(stateContainer.state, null, 2);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        addLog("positive", "存档 JSON 已复制到剪贴板。", "career");
        render();
      });
    } else {
      addLog("warning", "当前浏览器不支持自动复制，请直接使用本地存档继续游玩。", "career");
      render();
    }
  }

  function importSave() {
    const text = window.prompt("粘贴之前导出的存档 JSON：");
    if (!text) return;
    try {
      const imported = JSON.parse(text);
      if (!imported || !imported.player || !imported.player.clubId) {
        throw new Error("Invalid save");
      }
      stateContainer.state = normalizeLoadedState(imported);
      if (!Array.isArray(stateContainer.state.euroBonusLeagues)) {
        stateContainer.state.euroBonusLeagues = drawEuroBonusLeagues();
      }
      ensureLeagueSeason(currentClub().league);
      refreshClubQualifications();
      ensureEuropeanCampaign();
      addLog("positive", "存档导入成功。", "career");
      saveGame(true);
      showGame();
      render();
    } catch (error) {
      window.alert("导入失败：这段内容不是有效的球王之路存档。");
    }
  }

  function resetSave() {
    const confirmed = window.confirm("确定要清除当前存档并重新开档吗？");
    if (!confirmed) return;
    localStorage.removeItem(SAVE_KEY);
    stateContainer.state = null;
    showSetup();
  }

  function bindEvents() {
    $("#setupForm").addEventListener("submit", startNewGame);
    $("#saveButton").addEventListener("click", () => saveGame(false));
    document.addEventListener("click", (event) => {
      const target = event.target.closest("button");
      if (!target) return;
      if (target.dataset.tab) {
        stateContainer.activeTab = target.dataset.tab;
        render();
      }
      if (target.dataset.action === "advance-detailed") advanceWeek(true);
      if (target.dataset.action === "advance-skip") advanceWeek(false);
      if (target.dataset.action === "train-normal") train("normal");
      if (target.dataset.action === "train-intense") train("intense");
      if (target.dataset.action === "train-recovery") train("recovery");
      if (target.dataset.action === "toggle-career-timeline") {
        stateContainer.careerTimelineCollapsed = !stateContainer.careerTimelineCollapsed;
        render();
      }
      if (target.dataset.action === "toggle-market-offers") {
        stateContainer.marketOffersCollapsed = !stateContainer.marketOffersCollapsed;
        render();
      }
      if (target.dataset.action === "honor-sort") {
        stateContainer.honorSort = target.dataset.sort === "competition" ? "competition" : "time";
        render();
      }
      if (target.dataset.action === "export-save") exportSave();
      if (target.dataset.action === "import-save") importSave();
      if (target.dataset.action === "reset-save") resetSave();
      if (target.dataset.strategy) setTransferStrategy(target.dataset.strategy);
      if (target.dataset.offer) acceptOffer(Number(target.dataset.offer));
      if (target.dataset.offerReject) rejectOffer(Number(target.dataset.offerReject));
      if (target.dataset.choice) answerChoice(Number(target.dataset.choice));
    });
  }

  function populateSetup() {
    $("#nationality").innerHTML = NATIONALITIES.map((name) => `<option value="${name}">${name}</option>`).join("");
    $("#position").innerHTML = POSITIONS.map((position) => `<option value="${position.id}">${position.name}</option>`).join("");
    $("#nationality").value = "中国";
    $("#position").value = "ST";
  }

  function boot() {
    populateSetup();
    bindEvents();
    registerServiceWorker();
    const loaded = loadGame();
    if (loaded && loaded.player) {
      stateContainer.state = loaded;
      if (!Array.isArray(stateContainer.state.euroBonusLeagues)) {
        stateContainer.state.euroBonusLeagues = drawEuroBonusLeagues();
      }
      ensureLeagueSeason(currentClub().league);
      refreshClubQualifications();
      ensureEuropeanCampaign();
      showGame();
      render();
    }
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((error) => {
        console.warn("Service worker registration failed", error);
      });
    });
  }

  boot();
})();
