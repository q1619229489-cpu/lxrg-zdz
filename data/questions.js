export const questions = [
  { id: 1, text: '早上八点到目的地，酒店要下午才能入住，你会：', options: [
    { text: '行李寄存，立刻冲去第一个打卡点', personality: '特种兵', traits: { action: 3, planning: 1, spontaneity: 0, food: -1, photo: 0, budget: 0 } },
    { text: '找个咖啡馆坐下，开始修手机里的图', personality: '摄影大师', traits: { action: -1, planning: 0, photo: 3, spontaneity: 1, food: 1, budget: 0 } },
    { text: '在大堂沙发躺下，先睡个回笼觉', personality: '卡皮巴适', traits: { action: -2, planning: -1, photo: -1, spontaneity: 2, food: 0, budget: 0 } },
    { text: '拿出提前做好的行程表核对今日计划', personality: '预制人', traits: { action: 0, planning: 3, photo: 0, spontaneity: -2, food: 0, budget: 1 } },
    { text: '打开美食软件，先把附近想吃的店收藏一遍', personality: '吗当喽', traits: { action: 0, planning: 1, photo: 0, spontaneity: 1, food: 3, budget: 0 } }
  ]},
  { id: 2, text: '出发前三天，你的行李箱状态是：', options: [
    { text: '已经整整齐齐码好，分类袋装好还贴了标签', personality: '预制人', traits: { action: 0, planning: 3, photo: 0, spontaneity: -2, food: 0, budget: 1 } },
    { text: '还没动，出发前一晚再说', personality: '卡皮巴适', traits: { action: -1, planning: -2, photo: 0, spontaneity: 2, food: 0, budget: 0 } },
    { text: '带了五套衣服配三双鞋，虽然只去两天', personality: '摄影大师', traits: { action: 0, planning: 1, photo: 2, spontaneity: 0, food: 0, budget: -1 } },
    { text: '已经装满零食和自热锅，生怕路上饿着', personality: '吗当喽', traits: { action: 0, planning: 0, photo: -1, spontaneity: 0, food: 3, budget: 0 } },
    { text: '背个书包就走，多了嫌重', personality: '特种兵', traits: { action: 2, planning: -1, photo: -1, spontaneity: 1, food: -1, budget: 2 } }
  ]},
  { id: 3, text: '到了住宿的地方，你最先关注的是：', options: [
    { text: '附近三公里内有什么好吃的店', personality: '吗当喽', traits: { action: 1, planning: 0, photo: 0, spontaneity: 1, food: 3, budget: 0 } },
    { text: '床垫软不软、枕头高不高、空调够不够冷', personality: '卡皮巴适', traits: { action: -2, planning: 0, photo: 0, spontaneity: 1, food: 1, budget: 0 } },
    { text: '附近有没有好看的打卡圣地', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 3, spontaneity: 0, food: 0, budget: 0 } },
    { text: '早点休息，明天好疯玩一整天', personality: '特种兵', traits: { action: 2, planning: 2, photo: 0, spontaneity: -1, food: 0, budget: 0 } },
    { text: '检查房间设施是否和预订时说的一样', personality: '预制人', traits: { action: 0, planning: 2, photo: 0, spontaneity: -1, food: 0, budget: 1 } }
  ]},
  { id: 4, text: '旅途中突然下大雨，你会：', options: [
    { text: '继续走，雨中步行更有感觉', personality: '特种兵', traits: { action: 3, planning: 0, photo: 0, spontaneity: 1, food: -1, budget: 0 } },
    { text: '找地方躲雨顺便拍雨景', personality: '摄影大师', traits: { action: -1, planning: 0, photo: 3, spontaneity: 1, food: 0, budget: 0 } },
    { text: '立刻打车回住的地方躺平', personality: '卡皮巴适', traits: { action: -2, planning: -1, photo: 0, spontaneity: 0, food: 0, budget: -1 } },
    { text: '躲进附近小店随机吃点东西避雨', personality: '吗当喽', traits: { action: 0, planning: -1, photo: 0, spontaneity: 2, food: 2, budget: 0 } },
    { text: '翻出包里备用的伞和鞋套，早就想到了', personality: '预制人', traits: { action: 0, planning: 3, photo: 0, spontaneity: -1, food: 0, budget: 1 } }
  ]},
  { id: 5, text: '朋友提议去一个没听过的景点，你会：', options: [
    { text: '先查攻略看评分再决定', personality: '预制人', traits: { action: 0, planning: 3, photo: 0, spontaneity: -2, food: 0, budget: 1 } },
    { text: '随缘咯，反正也是到处乱逛', personality: '哈基迷', traits: { action: 1, planning: -2, photo: 1, spontaneity: 3, food: 0, budget: 0 } },
    { text: '远不远？太远就不去了', personality: '卡皮巴适', traits: { action: -2, planning: 1, photo: 0, spontaneity: 0, food: 0, budget: 0 } },
    { text: '先问那边有什么好吃的', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 1, food: 3, budget: 0 } },
    { text: '能不能出片？', personality: '摄影大师', traits: { action: 0, planning: 1, photo: 3, spontaneity: 1, food: -1, budget: 0 } }
  ]},
  { id: 6, text: '你的旅行闹钟一般定在：', options: [
    { text: '越早越好，为了能去更多景点', personality: '特种兵', traits: { action: 3, planning: 1, photo: 0, spontaneity: -1, food: -1, budget: 0 } },
    { text: '自然醒，旅行就是用来休息的', personality: '卡皮巴适', traits: { action: -2, planning: -1, photo: 0, spontaneity: 1, food: 0, budget: 0 } },
    { text: '调好几个闹钟，每个景点对应一个时间', personality: '预制人', traits: { action: 0, planning: 2, photo: 0, spontaneity: -1, food: 0, budget: 0 } },
    { text: '设一个，但不会起床，关了继续睡', personality: '哈基迷', traits: { action: -1, planning: -2, photo: 0, spontaneity: 2, food: 0, budget: 0 } },
    { text: '日出前半小时，为了拍到晨光', personality: '摄影大师', traits: { action: 1, planning: 0, photo: 3, spontaneity: 0, food: 0, budget: 0 } }
  ]},
  { id: 7, text: '你觉得以下哪种旅行方式最吸引你：', options: [
    { text: '一天走完八个景点', personality: '特种兵', traits: { action: 2, planning: 0, photo: 1, spontaneity: -1, food: -1, budget: 0 } },
    { text: '睡到自然醒，在酒店看剧点外卖', personality: '卡皮巴适', traits: { action: -2, planning: -1, photo: 0, spontaneity: 1, food: 1, budget: 0 } },
    { text: '一条街从头吃到尾，每家店都不放过', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 1, food: 3, budget: 0 } },
    { text: '找一个人少的宝藏地点拍照', personality: '摄影大师', traits: { action: -1, planning: 0, photo: 2, spontaneity: 1, food: 0, budget: 0 } },
    { text: '跟着感觉走，没有计划就是最好的计划', personality: '哈基迷', traits: { action: 0, planning: -2, photo: 0, spontaneity: 3, food: 0, budget: 0 } }
  ]},
  { id: 8, text: '旅行中你最不能接受的是：', options: [
    { text: '浪费时间，景点还没去够', personality: '特种兵', traits: { action: 2, planning: 0, photo: 0, spontaneity: -1, food: 0, budget: 0 } },
    { text: '吃得太差，旅行不就是为了吃吗', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 0, food: 3, budget: 0 } },
    { text: '拍照不好看，白来了', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 3, spontaneity: 0, food: 0, budget: 0 } },
    { text: '计划被打乱，一切不在掌控中', personality: '预制人', traits: { action: 0, planning: 2, photo: 0, spontaneity: -1, food: 0, budget: 1 } },
    { text: '人生地不熟，找不到方向', personality: '哈基迷', traits: { action: 0, planning: 0, photo: 0, spontaneity: 1, food: 0, budget: 0 } }
  ]},
  { id: 9, text: '看到别人发的旅行朋友圈，你最先关注的是：', options: [
    { text: '这地方我也去过！', personality: '特种兵', traits: { action: 2, planning: 0, photo: 0, spontaneity: 0, food: 0, budget: 0 } },
    { text: '吃的看起来怎么样，求地址', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 0, food: 3, budget: 0 } },
    { text: '照片拍的好不好看', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 3, spontaneity: 0, food: 0, budget: 0 } },
    { text: '这条路线我早就做好攻略了', personality: '预制人', traits: { action: 0, planning: 2, photo: 0, spontaneity: -1, food: 0, budget: 0 } },
    { text: '好美啊，下次我也要去（然后忘掉）', personality: '哈基迷', traits: { action: 0, planning: -1, photo: 1, spontaneity: 2, food: 0, budget: 0 } }
  ]},
  { id: 10, text: '如果旅伴说"我们随便逛逛吧"，你心里想的是：', options: [
    { text: '随便逛逛是逛哪里？先定个路线吧', personality: '预制人', traits: { action: 0, planning: 2, photo: 0, spontaneity: -2, food: 0, budget: 1 } },
    { text: '好呀好呀，往人多的地方走就对了', personality: '哈基迷', traits: { action: 0, planning: -2, photo: 1, spontaneity: 3, food: 0, budget: 0 } },
    { text: '走吧，但别走太远，走累了我要休息', personality: '卡皮巴适', traits: { action: -2, planning: 0, photo: 0, spontaneity: 1, food: 0, budget: 0 } },
    { text: '随便逛也行，把我想去的点穿插进去', personality: '特种兵', traits: { action: 2, planning: 1, photo: 0, spontaneity: -1, food: 0, budget: 0 } },
    { text: '带上相机，随便逛也能出片', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 2, spontaneity: 1, food: 0, budget: 0 } }
  ]},
  { id: 11, text: '旅途中你想吃午餐了，你会：', options: [
    { text: '搜附近评分最高的店，按导航走过去', personality: '吗当喽', traits: { action: 1, planning: 0, photo: 0, spontaneity: 0, food: 3, budget: 0 } },
    { text: '路边看到哪家顺眼就进去', personality: '哈基迷', traits: { action: 0, planning: -1, photo: 0, spontaneity: 2, food: 1, budget: 0 } },
    { text: '随便吃一口，不饿就行，别耽误看景点', personality: '特种兵', traits: { action: 2, planning: 0, photo: 0, spontaneity: 0, food: -2, budget: 0 } },
    { text: '找一家装修好看的餐厅，先拍了再吃', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 3, spontaneity: 0, food: 1, budget: 0 } },
    { text: '按攻略上提前标记好的餐厅去', personality: '预制人', traits: { action: 0, planning: 2, photo: 0, spontaneity: -1, food: 1, budget: 1 } }
  ]},
  { id: 12, text: '你的旅行预算通常是：', options: [
    { text: '能省则省，住青旅吃路边摊也行', personality: '特种兵', traits: { action: 2, planning: 0, photo: 0, spontaneity: 0, food: -1, budget: 3 } },
    { text: '该花就花，但会在多个平台比价很久', personality: '预制人', traits: { action: 0, planning: 2, photo: 0, spontaneity: 0, food: 0, budget: 2 } },
    { text: '吃上面不省，其他可以将就', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 0, food: 3, budget: -1 } },
    { text: '住和吃都随缘，好玩就行', personality: '哈基迷', traits: { action: 0, planning: -2, photo: 0, spontaneity: 1, food: 0, budget: -2 } },
    { text: '只要去的地方好看，多花点钱都行', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 2, spontaneity: 0, food: 1, budget: -2 } }
  ]},
  { id: 13, text: '旅途中朋友迷路了，你会：', options: [
    { text: '拿出手机导航，我来带路', personality: '特种兵', traits: { action: 2, planning: 0, photo: 0, spontaneity: -1, food: 0, budget: 0 } },
    { text: '没事，迷路也是旅行的乐趣', personality: '哈基迷', traits: { action: 0, planning: -2, photo: 1, spontaneity: 3, food: 0, budget: 0 } },
    { text: '先找个地方坐下来，不急慢慢找', personality: '卡皮巴适', traits: { action: -2, planning: 0, photo: 0, spontaneity: 1, food: 0, budget: 0 } },
    { text: '正好可以看到意外的风景', personality: '摄影大师', traits: { action: -1, planning: 0, photo: 2, spontaneity: 1, food: 0, budget: 0 } },
    { text: '拿出提前准备好的计划', personality: '预制人', traits: { action: 0, planning: 2, photo: 0, spontaneity: -1, food: 0, budget: 1 } }
  ]},  { id: 14, text: '如果旅途中你手机快没电了，你会想：', options: [
    { text: '我的步数记录不了了', personality: '特种兵', traits: { action: 1, planning: 0, photo: 0, spontaneity: 0, food: 0, budget: 0 } },
    { text: '不慌不忙，拿出准备好的充电宝', personality: '预制人', traits: { action: 0, planning: 1, photo: 0, spontaneity: 0, food: 0, budget: 0 } },
    { text: '还是先回旅店吧', personality: '卡皮巴适', traits: { action: -1, planning: 0, photo: 0, spontaneity: 0, food: 0, budget: 0 } },
    { text: '买不到好吃的了', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 0, food: 2, budget: 0 } },
    { text: '错过好多拍照机会，难受', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 2, spontaneity: 0, food: 0, budget: 0 } }
  ]}
  ]},
  { id: 15, text: '你对"特产"的态度是：', options: [
    { text: '买当地特色食品，回家慢慢吃', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 0, food: 2, budget: 0 } },
    { text: '买特产只会占用我旅行的时间', personality: '特种兵', traits: { action: 1, planning: 0, photo: 0, spontaneity: 0, food: 0, budget: 1 } },
    { text: '不买，嫌麻烦嫌重', personality: '卡皮巴适', traits: { action: -1, planning: 0, photo: 0, spontaneity: 0, food: 0, budget: 0 } },
    { text: '买好看的文创产品，有纪念意义', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 2, spontaneity: 0, food: 0, budget: -1 } },
    { text: '提前列好特产清单，能买就买', personality: '预制人', traits: { action: 0, planning: 2, photo: 0, spontaneity: -1, food: 0, budget: 1 } }
  ]}
]

export const questionsPart2 = [
  { id: 16, text: '朋友说\"我们拍张合影吧\"，你会更倾向于：', options: [
    { text: '好，速战速决，别耽误时间', personality: '特种兵', traits: { action: 2, planning: 0, photo: -1, spontaneity: 0, food: 0, budget: 0 } },
    { text: '找角度调光线，拍满意为止', personality: '摄影大师', traits: { action: -1, planning: 1, photo: 3, spontaneity: -1, food: 0, budget: 0 } },
    { text: '随便拍一张就行，又不发朋友圈', personality: '卡皮巴适', traits: { action: -1, planning: -1, photo: -2, spontaneity: 1, food: 0, budget: 0 } },
    { text: '拍完先发给我，我要发朋友圈', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 0, food: 1, budget: 0 } },
    { text: '先查查有没有拍照技巧', personality: '预制人', traits: { action: 0, planning: 2, photo: 1, spontaneity: -1, food: 0, budget: 0 } }
  ]},
  { id: 17, text: '你在路上的状态更接近：', options: [
    { text: '健步如飞，朋友在后面追着喊慢点', personality: '特种兵', traits: { action: 3, planning: 0, photo: -1, spontaneity: 0, food: -1, budget: 0 } },
    { text: '走走停停，看到好看的就要停下来', personality: '摄影大师', traits: { action: -2, planning: 0, photo: 3, spontaneity: 1, food: 0, budget: 0 } },
    { text: '慢悠悠地晃，走两步就想坐', personality: '卡皮巴适', traits: { action: -2, planning: -1, photo: 0, spontaneity: 1, food: 0, budget: 0 } },
    { text: '拿着手机导航还走错路', personality: '哈基迷', traits: { action: 0, planning: -2, photo: 0, spontaneity: 2, food: 0, budget: 0 } },
    { text: '边走边确认有没有和计划偏差太多', personality: '预制人', traits: { action: 0, planning: 0, photo: 0, spontaneity: 0, food: 3, budget: 0 } }
  ]},
  { id: 18, text: '到一个陌生城市，你最先打开的是：', options: [
    { text: '地图软件，标记所有想去的地方', personality: '预制人', traits: { action: 1, planning: 3, photo: 0, spontaneity: -2, food: 0, budget: 0 } },
    { text: '美食软件，看看附近评分高的店', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 0, food: 3, budget: 0 } },
    { text: '相机，先拍几张街景找找感觉', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 3, spontaneity: 0, food: 0, budget: 0 } },
    { text: '打车软件，先回酒店休息会再说', personality: '卡皮巴适', traits: { action: -1, planning: 0, photo: 0, spontaneity: 1, food: 0, budget: 0 } },
    { text: '随便看看', personality: '哈基迷', traits: { action: 0, planning: -2, photo: 1, spontaneity: 3, food: 0, budget: -1 } }
  ]},
  { id: 19, text: '旅游攻略你一般怎么做：', options: [
    { text: '做详细的攻略', personality: '预制人', traits: { action: 0, planning: 3, photo: 0, spontaneity: -3, food: 0, budget: 1 } },
    { text: '把行程安排得满满当当的', personality: '特种兵', traits: { action: 2, planning: 1, photo: 0, spontaneity: 0, food: 0, budget: 0 } },
    { text: '只看美食攻略，景点随缘', personality: '吗当喽', traits: { action: 0, planning: 0, photo: -1, spontaneity: 1, food: 3, budget: 0 } },
    { text: '小红书上搜拍照机位，其他不重要', personality: '摄影大师', traits: { action: 0, planning: 1, photo: 3, spontaneity: 0, food: -1, budget: 0 } },
    { text: '不做攻略，到了再说', personality: '哈基迷', traits: { action: 0, planning: -2, photo: 0, spontaneity: 3, food: 0, budget: 2 } }
  ]},
  { id: 20, text: '你理想中的旅行目的地是什么样的？（可多选）', multi: true, options: [
    { text: '自然风光绝美，可以爬山徒步', personality: '特种兵', traits: { action: 2, planning: 0, photo: 0, spontaneity: 0, food: 0, budget: 0 } },
    { text: '有好吃到让人流泪的地方美食', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 0, food: 2, budget: 0 } },
    { text: '随便一个小镇，没有目的随便逛', personality: '哈基迷', traits: { action: 0, planning: -1, photo: 0, spontaneity: 2, food: 0, budget: 0 } },
    { text: '出片率高的地方，随手一拍都是大片', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 2, spontaneity: 0, food: 0, budget: 0 } },
    { text: '历史人文底蕴深厚，得提前做功课的', personality: '预制人', traits: { action: -2, planning: 0, photo: 0, spontaneity: 0, food: 0, budget: -1 } }
  ]},
  { id: 21, text: '你的旅行鞋更可能是：', options: [
    { text: '运动鞋，日均两万步不是梦', personality: '特种兵', traits: { action: 3, planning: 0, photo: 0, spontaneity: -1, food: 0, budget: 0 } },
    { text: '舒服最重要', personality: '卡皮巴适', traits: { action: -2, planning: -1, photo: 0, spontaneity: 1, food: 0, budget: 0 } },
    { text: '哪双好看出片就选', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 2, spontaneity: 0, food: 0, budget: 0 } },
    { text: '随便选一双吧', personality: '哈基迷', traits: { action: 0, planning: -1, photo: 0, spontaneity: 1, food: 0, budget: 0 } },
    { text: '多准备几双鞋，万一用上了呢', personality: '预制人', traits: { action: 0, planning: 2, photo: 0, spontaneity: 0, food: 0, budget: -1 } }
  ]},  { id: 22, text: '你在旅途中看到排长队的网红店，你会想：', options: [
    { text: '排！来都来了', personality: '特种兵', traits: { action: 2, planning: 0, photo: 0, spontaneity: 0, food: 0, budget: 0 } },
    { text: '看看卖什么的，是吃的就排', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 0, food: 2, budget: 0 } },
    { text: '只会耽误了我拍照打卡', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 1, spontaneity: 0, food: 0, budget: 0 } },
    { text: '算了，我只想早点逛完', personality: '卡皮巴适', traits: { action: -1, planning: 0, photo: 0, spontaneity: 0, food: 0, budget: 0 } },
    { text: '不排，因为我查过攻略避雷了', personality: '预制人', traits: { action: 0, planning: 1, photo: 0, spontaneity: 0, food: 0, budget: 0 } }
  ]}
  ]},  { id: 23, text: '你对旅行住宿的选择更看重什么？', options: [
    { text: '位置好，方便去各个景点', personality: '特种兵', traits: { action: 1, planning: 1, photo: 0, spontaneity: 0, food: 0, budget: 0 } },
    { text: '床舒服，能好好休息就行', personality: '卡皮巴适', traits: { action: -1, planning: 0, photo: 0, spontaneity: 1, food: 0, budget: 0 } },
    { text: '附近美食多，下楼就能吃', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 0, food: 2, budget: 0 } },
    { text: '装修好看，拍照出片', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 2, spontaneity: 0, food: 0, budget: 0 } },
    { text: '性价比高，提前比价选好', personality: '预制人', traits: { action: 0, planning: 2, photo: 0, spontaneity: 0, food: 0, budget: 1 } }
  ]}
  ]},  { id: 24, text: '旅行中计划有变，你有半天自由时间，你更愿意怎么度过？', options: [
    { text: '多打卡几个地方', personality: '特种兵', traits: { action: 2, planning: 0, photo: 0, spontaneity: 0, food: 0, budget: 0 } },
    { text: '找个地方坐下来，放空自己', personality: '卡皮巴适', traits: { action: 0, planning: 0, photo: 0, spontaneity: 1, food: 0, budget: 0 } },
    { text: '去找当地有名的美食', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 0, food: 2, budget: 0 } },
    { text: '去一个出片率高的小众景点', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 2, spontaneity: 0, food: 0, budget: 0 } },
    { text: '按照自己之前计划进行', personality: '预制人', traits: { action: 0, planning: 1, photo: 0, spontaneity: 0, food: 0, budget: 0 } }
  ]}
  ]},
  { id: 25, text: '你心中完美的旅行日应该是：', options: [
    { text: '五点起床看日出，上午逛三个景点', personality: '特种兵', traits: { action: 3, planning: 1, photo: 0, spontaneity: -1, food: -1, budget: 0 } },
    { text: '睡到中午，点个外卖在酒店看剧', personality: '卡皮巴适', traits: { action: -2, planning: -1, photo: 0, spontaneity: 1, food: 1, budget: 0 } },
    { text: '从早市吃到夜市，中间随便逛逛', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 1, food: 3, budget: 0 } },
    { text: '带上相机，走到哪拍到哪', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 3, spontaneity: 1, food: 0, budget: 0 } },
    { text: '出门随便走走，遇到什么是什么', personality: '哈基迷', traits: { action: 0, planning: -2, photo: 1, spontaneity: 3, food: 0, budget: 0 } }
  ]},
  { id: 26, text: '朋友发来一个旅行攻略链接，你会：', options: [
    { text: '认真看完并用备忘录做笔记', personality: '预制人', traits: { action: 0, planning: 3, photo: 0, spontaneity: -2, food: 0, budget: 1 } },
    { text: '收藏等于看过，再也没打开过', personality: '卡皮巴适', traits: { action: -1, planning: -2, photo: 0, spontaneity: 1, food: 0, budget: 0 } },
    { text: '只看美食推荐部分', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 0, food: 3, budget: 0 } },
    { text: '只看拍照机位推荐', personality: '摄影大师', traits: { action: 0, planning: 1, photo: 3, spontaneity: 0, food: -1, budget: 0 } },
    { text: '扫一眼标题，到地方再说', personality: '哈基迷', traits: { action: 0, planning: -2, photo: 0, spontaneity: 2, food: 0, budget: 0 } }
  ]},
  { id: 27, text: '你觉得旅行的意义更接近于：', options: [
    { text: '挑战自我，征服每一个目的地', personality: '特种兵', traits: { action: 3, planning: 0, photo: 0, spontaneity: 0, food: -1, budget: 0 } },
    { text: '换个地方躺平休息', personality: '卡皮巴适', traits: { action: -2, planning: -1, photo: -1, spontaneity: 1, food: 0, budget: 0 } },
    { text: '体验不同地方的美食文化', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 1, food: 3, budget: 0 } },
    { text: '记录美好瞬间，留下好看的照片', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 3, spontaneity: 0, food: 0, budget: 0 } },
    { text: '体验不确定性，享受意外惊喜', personality: '哈基迷', traits: { action: 0, planning: -2, photo: 0, spontaneity: 3, food: 0, budget: 0 } }
  ]},
  { id: 28, text: '你更愿意和什么样的人一起旅行：', options: [
    { text: '执行力强的，说走就能走', personality: '特种兵', traits: { action: 2, planning: 0, photo: 0, spontaneity: -1, food: 0, budget: 0 } },
    { text: '佛系的，不赶时间不焦虑', personality: '卡皮巴适', traits: { action: -1, planning: -1, photo: 0, spontaneity: 1, food: 0, budget: 0 } },
    { text: '懂吃的，能带着找好吃的', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 0, food: 3, budget: 0 } },
    { text: '会拍照的，能把我拍好看', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 3, spontaneity: 0, food: 0, budget: 0 } },
    { text: '随性的，想干嘛就干嘛', personality: '哈基迷', traits: { action: 0, planning: -2, photo: 0, spontaneity: 2, food: 0, budget: 0 } }
  ]},
  { id: 29, text: '旅行结束时，你的感受更接近：', options: [
    { text: '意犹未尽，还有好多地方没去', personality: '特种兵', traits: { action: 2, planning: 1, photo: 0, spontaneity: 0, food: 0, budget: 0 } },
    { text: '终于可以回家躺平了', personality: '卡皮巴适', traits: { action: -2, planning: -1, photo: 0, spontaneity: 0, food: 0, budget: 0 } },
    { text: '最后再吃一顿好的再走', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 0, food: 3, budget: 0 } },
    { text: '拍了好多好看的照片，回去要好好修修', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 3, spontaneity: 0, food: 0, budget: 0 } },
    { text: '好神奇的旅程，完全没想到会是这样', personality: '哈基迷', traits: { action: 0, planning: -1, photo: 0, spontaneity: 3, food: 0, budget: 0 } }
  ]},  { id: 30, text: '下一次旅行，你比较看重哪些？（可多选）', multi: true, options: [
    { text: '自然风光适合徒步', personality: '特种兵', traits: { action: 2, planning: 0, photo: 0, spontaneity: 0, food: 0, budget: 0 } },
    { text: '美食圣地', personality: '吗当喽', traits: { action: 0, planning: 0, photo: 0, spontaneity: 0, food: 2, budget: 0 } },
    { text: '打卡圣地好出片', personality: '摄影大师', traits: { action: 0, planning: 0, photo: 2, spontaneity: 0, food: 0, budget: 0 } },
    { text: '攻略是否好做', personality: '预制人', traits: { action: 0, planning: 2, photo: 0, spontaneity: 0, food: 0, budget: 0 } },
    { text: '没想好，看心情看缘分', personality: '哈基迷', traits: { action: 0, planning: 0, photo: 0, spontaneity: 2, food: 0, budget: 0 } }
  ]}
  ]}
]

export const allQuestions = questions.concat(questionsPart2)
