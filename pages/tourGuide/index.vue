<template>
  <yy-paging v-model="state.dataList" @query="queryList" ref="paging" @scroll="scroll" v-bind="pagingConfig">
    <template #top>
      <view id="top-bar" class="flex flex-col gap-2 p-3">
        <u-search
          bg-color="#fff"
          v-model="state.keyword"
          placeholder="搜索想看的景区"
          :show-action="false"
          @search="handleSearch"
        ></u-search>
        <!-- 筛选栏 -->
        <view class="flex items-center justify-between">
          <view class="text-sm font-medium text-gray-900">全部</view>
          <view class="flex items-center gap-1" @click="showLevelPicker = true">
            <view class="text-xs text-gray-500">景区等级</view>
            <!-- <u-icon name="arrow-down" size="20" color="#999"></u-icon> -->

            <yy-icon size="20" color="#999" name="ri:arrow-down-s-line" v-if="!showLevelPicker"></yy-icon>
            <yy-icon size="20" color="#999" name="ri:arrow-up-s-line" v-else></yy-icon>
          </view>
        </view>
      </view>
    </template>

    <!-- <view :style="{ height: containerHeight }" class="w-5 bg-red-900">3</view> -->
    <view class="flex overflow-hidden" :style="{ height: containerHeight }">
      <!-- 左侧城市列表 -->
      <scroll-view
        scroll-y
        class="bg-gray-50 flex flex-col w-20"
        :style="{ height: containerHeight }"
        :scroll-top="scrollTop"
        scroll-with-animation
      >
        <view
          class="u-tab-item relative flex items-center justify-center px-2 py-3 text-sm transition-colors"
          :class="current === index ? 'bg-white text-gray-900 font-medium' : 'text-gray-500'"
          v-for="(item, index) in state.cityList"
          :key="item"
        >
          <view
            v-if="current === index"
            class="top-1/2 absolute left-0 w-1 h-4 -translate-y-1/2 rounded-r-full"
            :style="{ backgroundColor: uni.$u.color.primary }"
          ></view>
          {{ item }}
        </view>
      </scroll-view>
      <!-- 右侧内容区 -->
      <scroll-view
        scroll-y
        class="*:flex *:flex-col flex-1 *:gap-3 px-3"
        :style="{ height: containerHeight }"
        :scroll-top="scrollRightTop"
        scroll-with-animation
        @scroll="rightScroll"
      >
        <!-- 按城市分组的景区列表  flex flex-col gap-3 pb-3-->
        <view
          class="city-block"
          v-for="(group, cityIndex) in state.groupedData"
          :key="cityIndex"
          :id="'city-block-' + cityIndex"
        >
          <view class="flex flex-col gap-3 pb-3" v-if="group.list.length > 0">
            <view class="flex flex-col gap-3">
              <view
                class="flex gap-3 transition-all"
                :class="{ 'border-2 border-solid rounded-lg p-1': isMatch(item) }"
                :style="isMatch(item) ? { borderColor: uni.$u.color.primary } : {}"
                v-for="(item, index) in group.list"
                :key="index"
                @click.stop="goToDetails(item)"
              >
                <view class="w-28 h-28 bg-slate-200 relative flex-shrink-0 overflow-hidden rounded-lg">
                  <u-image :src="item.image" class="!size-28" mode="aspectFill" width="100%" height="100%"></u-image>

                  <view
                    class="absolute bottom-0 left-0 px-1.5 py-0.5 text-xs text-white rounded-tr-md"
                    :style="{ backgroundColor: uni.$u.color.primary }"
                  >
                    {{ item.level }}
                  </view>
                </view>
                <view class="flex flex-col justify-between flex-1 py-1">
                  <view class="flex flex-col gap-1">
                    <view class="text-sm font-medium text-gray-900">{{ item.name }}</view>
                    <view class="flex flex-wrap gap-1">
                      <u-tag v-for="tag in item.tags" :key="tag" :text="tag" size="mini" type="primary"></u-tag>
                    </view>
                  </view>
                  <view class="text-xs text-gray-400">{{ item.address }}</view>
                </view>
              </view>
            </view>
          </view>
          <!-- <view class="flex items-center gap-2" :class="cityIndex == 0 ? '' : 'mt-3'">
            <view class="w-1 h-4 rounded-full" :style="{ backgroundColor: uni.$u.color.primary }"></view>
            <view class="text-sm font-medium text-gray-900">{{ group.city }}</view>
          </view> -->
          <!-- <view v-if="group.list.length === 0" class="py-4 text-xs text-center text-gray-400">暂无景区</view> -->
        </view>
      </scroll-view>
    </view>

    <yy-picker-modal
      v-model="showLevelPicker"
      title="选择景区等级"
      :list="state.levelList"
      :value="state.currentLevel"
      @change="selectLevel"
    />
  </yy-paging>
</template>

<script setup>
  const pagingConfig = ref({
    auto: true,
    refresherEnabled: false,
    showRefresherWhenReload: false,
    showTabbar: true,
    hideNav: false,
    showNavBack: false,
    navTitle: '旅游中心',
    color: uni.$u.color.primary,
    loadingMoreNoMoreText: '',
    emptyText: '',
    // usePageScroll: true,
  })

  const state = ref({
    isScroll: false,
    keyword: '',
    dataList: [],
    groupedData: [],
    cityList: [
      '和平区',
      '河东区',
      '河西区',
      '南开区',
      '河北区',
      '红桥区',
      '东丽区',
      '西青区',
      '津南区',
      '北辰区',
      '武清区',
      '宝坻区',
      '滨海新区',
      '宁河区',
      '静海区',
      '蓟州区',
    ],
    levelList: ['全部等级', '5A景区', '4A景区', '3A景区', '2A景区'],
    currentLevel: '全部等级',
  })

  const paging = ref()
  const showLevelPicker = ref(false)
  const containerHeight = ref('')
  const current = ref(0)
  const scrollTop = ref(0)
  const scrollRightTop = ref(0)
  const oldScrollTop = ref(0)
  const menuHeight = ref(0)
  const menuItemHeight = ref(0)
  const arr = ref([])
  const timer = ref(null)
  const searchKeyword = computed(() => state.value.keyword.trim().toLowerCase())

  const topHeights = ref(0)
  onLoad(options => {
    console.log('🚀 页面加载:', options)
  })

  onShow(options => {
    console.log('🚀 页面显示:', options)
  })

  onReady(() => {
    nextTick(() => {
      calcHeight()
      getMenuItemTop()
    })
  })

  function calcHeight() {
    const query = uni.createSelectorQuery()
    query.select('#top-bar').boundingClientRect()
    query.exec(res => {
      const sysInfo = uni.getSystemInfoSync()
      console.log('🚀 ~ :204 ~ calcHeight ~ sysInfo:', sysInfo)
      const windowHeight = sysInfo.windowHeight

      const topHeight = res[0]?.height || 0
      const statusBarHeight = sysInfo.statusBarHeight || 0
      // iOS 导航栏标准高度 44px，Android 及小程序为 48px
      const navHeight = sysInfo.osName === 'ios' ? 44 : 48
      const tabbarHeight = 50
      // 全面屏设备底部安全区高度（如 iPhone X 的 Home Indicator），非全面屏为 0
      const safeAreaBottom = sysInfo.safeAreaInsets?.bottom
      const faultTolerantPx = 4

      containerHeight.value =
        windowHeight - (topHeight + statusBarHeight + navHeight + tabbarHeight + safeAreaBottom + faultTolerantPx) + 'px'
    })
  }

  function goToDetails(city) {
    console.log('🚀 goToDetails:', city)
    vk.toast('功能开发中', 'none')
  }

  function scroll(e) {
    state.value.isScroll = e.detail.scrollTop > 0
  }

  function isMatch(item) {
    if (!searchKeyword.value) return false
    return item.name.toLowerCase().includes(searchKeyword.value)
  }

  function handleSearch() {
    if (!searchKeyword.value) {
      paging.value?.reload()
      return
    }
    const idx = state.value.groupedData.findIndex(group =>
      (group.list || []).some(item => item.name.toLowerCase().includes(searchKeyword.value)),
    )
    if (idx !== -1) {
      switchMenu(idx)
    } else {
      uni.$u.toast('没有找到该景区')
    }
  }

  async function switchMenu(index) {
    if (!state.value.cityList.length) return
    if (arr.value.length === 0) {
      await getMenuItemTop()
    }
    if (index === current.value) return
    scrollRightTop.value = oldScrollTop.value
    await nextTick()
    scrollRightTop.value = arr.value[index] || 0
    current.value = index
    leftMenuStatus(index)
  }

  async function leftMenuStatus(index) {
    current.value = index
    if (menuHeight.value === 0 || menuItemHeight.value === 0) {
      await getElRect('menu-scroll-view', 'menuHeight')
      await getElRect('u-tab-item', 'menuItemHeight')
    }
    scrollTop.value = index * menuItemHeight.value + menuItemHeight.value / 2 - menuHeight.value / 2
  }

  function getElRect(elClass, dataVal) {
    return new Promise(resolve => {
      const query = uni.createSelectorQuery()
      query
        .select('.' + elClass)
        .boundingClientRect(res => {
          const height = Array.isArray(res) ? res[0]?.height : res?.height
          if (typeof height !== 'number') {
            setTimeout(() => getElRect(elClass, dataVal), 10)
            return
          }
          if (dataVal === 'menuHeight') menuHeight.value = height
          if (dataVal === 'menuItemHeight') menuItemHeight.value = height
          resolve()
        })
        .exec()
    })
  }

  function getMenuItemTop() {
    return new Promise(resolve => {
      const query = uni.createSelectorQuery()
      query
        .selectAll('.city-block')
        .boundingClientRect(res => {
          if (!res || !Array.isArray(res) || !res.length) {
            setTimeout(() => getMenuItemTop(), 10)
            return
          }
          arr.value = []
          res.forEach((item, i) => {
            arr.value.push(item.top - res[0].top)
          })
          resolve()
        })
        .exec()
    })
  }

  async function rightScroll(e) {
    oldScrollTop.value = e.detail.scrollTop
    if (arr.value.length === 0) {
      await getMenuItemTop()
    }
    if (timer.value) return
    if (!menuHeight.value) {
      await getElRect('menu-scroll-view', 'menuHeight')
    }
    timer.value = setTimeout(() => {
      timer.value = null
      const scrollHeight = e.detail.scrollTop + menuHeight.value / 2
      for (let i = 0; i < arr.value.length; i++) {
        const height1 = arr.value[i]
        const height2 = arr.value[i + 1]
        if (!height2 || (scrollHeight >= height1 && scrollHeight < height2)) {
          leftMenuStatus(i)
          return
        }
      }
    }, 10)
  }

  function selectLevel(level) {
    state.value.currentLevel = level
    showLevelPicker.value = false
    paging.value?.reload()
  }

  async function queryList(page, limit) {
    // await new Promise(resolve => setTimeout(resolve, 0))

    const mockData = {
      和平区: [
        {
          name: '五大道文化旅游区',
          level: '4A景区',
          tags: ['历史文化', '洋楼建筑', '城市特色'],
          address: '和平区 重庆道',
          image: 'https://picsum.photos/200/200?random=1',
        },
        {
          name: '瓷房子',
          level: '3A景区',
          tags: ['城市特色', '博物馆', '艺术'],
          address: '和平区 赤峰道',
          image: 'https://picsum.photos/200/200?random=2',
        },
        {
          name: '静园',
          level: '3A景区',
          tags: ['历史建筑', '城市特色'],
          address: '和平区 鞍山道',
          image: 'https://picsum.photos/200/200?random=3',
        },
      ],
      河东区: [
        {
          name: '天津音乐街',
          level: '3A景区',
          tags: ['城市特色', '文化街区'],
          address: '河东区 八纬路',
          image: 'https://picsum.photos/200/200?random=4',
        },
        {
          name: '元明清天妃宫遗址博物馆',
          level: '3A景区',
          tags: ['历史文化', '博物馆'],
          address: '河东区 大直沽中路',
          image: 'https://picsum.photos/200/200?random=5',
        },
      ],
      河西区: [
        {
          name: '天塔湖风景区',
          level: '4A景区',
          tags: ['城市地标', '观光', '城市特色'],
          address: '河西区 卫津南路',
          image: 'https://picsum.photos/200/200?random=6',
        },
        {
          name: '天津博物馆',
          level: '4A景区',
          tags: ['博物馆', '文化', '亲子'],
          address: '河西区 平江道',
          image: 'https://picsum.photos/200/200?random=7',
        },
      ],
      南开区: [
        {
          name: '天津古文化街旅游区',
          level: '5A景区',
          tags: ['历史文化', '津门故里', '传统手艺'],
          address: '南开区 通北路',
          image: 'https://picsum.photos/200/200?random=8',
        },
        {
          name: '周恩来邓颖超纪念馆',
          level: '4A景区',
          tags: ['红色旅游', '历史文化', '亲子'],
          address: '南开区 水上公园西路',
          image: 'https://picsum.photos/200/200?random=9',
        },
        {
          name: '水上公园',
          level: '4A景区',
          tags: ['城市公园', '亲子', '休闲'],
          address: '南开区 水上公园北路',
          image: 'https://picsum.photos/200/200?random=10',
        },
      ],
      河北区: [
        {
          name: '意大利风情旅游区',
          level: '4A景区',
          tags: ['历史文化', '欧陆风情', '城市特色'],
          address: '河北区 光复道',
          image: 'https://picsum.photos/200/200?random=11',
        },
        {
          name: '天津之眼',
          level: '4A景区',
          tags: ['城市地标', '观光', '夜景'],
          address: '河北区 三岔河口',
          image: 'https://picsum.photos/200/200?random=12',
        },
      ],
      红桥区: [
        {
          name: '平津战役纪念馆',
          level: '4A景区',
          tags: ['红色旅游', '历史文化', '亲子'],
          address: '红桥区 平津道',
          image: 'https://picsum.photos/200/200?random=13',
        },
        {
          name: '估衣街',
          level: '2A景区',
          tags: ['历史文化', '传统商业', '城市特色'],
          address: '红桥区 估衣街',
          image: 'https://picsum.photos/200/200?random=14',
        },
      ],
      东丽区: [
        {
          name: '东丽湖温泉度假旅游区',
          level: '4A景区',
          tags: ['温泉度假', '休闲度假', '亲子'],
          address: '东丽区 东丽湖路',
          image: 'https://picsum.photos/200/200?random=15',
        },
      ],
      西青区: [
        {
          name: '石家大院',
          level: '4A景区',
          tags: ['历史文化', '民俗', '古建筑'],
          address: '西青区 杨柳青镇',
          image: 'https://picsum.photos/200/200?random=16',
        },
        {
          name: '精武门·中华武林园',
          level: '4A景区',
          tags: ['武术文化', '历史文化', '亲子'],
          address: '西青区 精武镇',
          image: 'https://picsum.photos/200/200?random=17',
        },
      ],
      津南区: [
        {
          name: '小站练兵园',
          level: '4A景区',
          tags: ['历史文化', '军事', '城市特色'],
          address: '津南区 小站镇',
          image: 'https://picsum.photos/200/200?random=18',
        },
      ],
      北辰区: [
        {
          name: '光合谷旅游度假区',
          level: '4A景区',
          tags: ['休闲度假', '亲子', '动物园'],
          address: '北辰区 双街镇',
          image: 'https://picsum.photos/200/200?random=19',
        },
      ],
      武清区: [
        {
          name: '南湖旅游景区',
          level: '4A景区',
          tags: ['城市公园', '湿地', '休闲'],
          address: '武清区 下朱庄街',
          image: 'https://picsum.photos/200/200?random=20',
        },
        {
          name: '津溪桃源',
          level: '3A景区',
          tags: ['乡村景区', '桃花', '休闲'],
          address: '武清区 汊沽港镇',
          image: 'https://picsum.photos/200/200?random=21',
        },
      ],
      宝坻区: [
        {
          name: '广济寺',
          level: '2A景区',
          tags: ['历史文化', '宗教', '古建筑'],
          address: '宝坻区 广济路',
          image: 'https://picsum.photos/200/200?random=22',
        },
        {
          name: '潮白河国家湿地公园',
          level: '3A景区',
          tags: ['自然风光', '湿地', '休闲'],
          address: '宝坻区 潮白河沿岸',
          image: 'https://picsum.photos/200/200?random=23',
        },
      ],
      滨海新区: [
        {
          name: '天津滨海航母主题公园',
          level: '4A景区',
          tags: ['军事主题', '亲子', '主题乐园'],
          address: '滨海新区 汉沽八卦滩',
          image: 'https://picsum.photos/200/200?random=24',
        },
        {
          name: '东疆湾沙滩景区',
          level: '4A景区',
          tags: ['海滨度假', '沙滩', '休闲'],
          address: '滨海新区 东疆港',
          image: 'https://picsum.photos/200/200?random=25',
        },
        {
          name: '天津方特欢乐世界',
          level: '4A景区',
          tags: ['主题乐园', '亲子', '刺激'],
          address: '滨海新区 中新生态城',
          image: 'https://picsum.photos/200/200?random=26',
        },
        {
          name: '海昌极地海洋公园',
          level: '4A景区',
          tags: ['海洋馆', '亲子', '动物'],
          address: '滨海新区 响螺湾',
          image: 'https://picsum.photos/200/200?random=27',
        },
        {
          name: '大沽口炮台遗址博物馆',
          level: '4A景区',
          tags: ['历史文化', '海防', '亲子'],
          address: '滨海新区 东炮台路',
          image: 'https://picsum.photos/200/200?random=28',
        },
      ],
      宁河区: [
        {
          name: '七里海湿地',
          level: '3A景区',
          tags: ['自然风光', '湿地', '生态旅游'],
          address: '宁河区 七里海镇',
          image: 'https://picsum.photos/200/200?random=29',
        },
      ],
      静海区: [
        {
          name: '团泊湖温泉酒店',
          level: '4A景区',
          tags: ['温泉度假', '休闲', '会议'],
          address: '静海区 团泊新城',
          image: 'https://picsum.photos/200/200?random=30',
        },
        {
          name: '萨马兰奇纪念馆',
          level: '4A景区',
          tags: ['体育文化', '博物馆', '亲子'],
          address: '静海区 团泊新城',
          image: 'https://picsum.photos/200/200?random=31',
        },
      ],
      蓟州区: [
        {
          name: '盘山风景名胜区',
          level: '5A景区',
          tags: ['山水游玩', '自然风光', '登山'],
          address: '蓟州区 官庄镇',
          image: 'https://picsum.photos/200/200?random=32',
        },
        {
          name: '黄崖关长城',
          level: '4A景区',
          tags: ['历史文化', '长城', '登山'],
          address: '蓟州区 下营镇',
          image: 'https://picsum.photos/200/200?random=33',
        },
        {
          name: '独乐寺',
          level: '4A景区',
          tags: ['历史文化', '古建筑', '宗教'],
          address: '蓟州区 武定街',
          image: 'https://picsum.photos/200/200?random=34',
        },
        {
          name: '梨木台风景区',
          level: '4A景区',
          tags: ['自然风光', '山水游玩', '森林'],
          address: '蓟州区 下营镇',
          image: 'https://picsum.photos/200/200?random=35',
        },
      ],
    }

    const grouped = []
    state.value.cityList.forEach(city => {
      let list = mockData[city] || []
      if (state.value.currentLevel !== '全部等级') {
        list = list.filter(item => item.level === state.value.currentLevel)
      }
      grouped.push({ city, list })
    })
    state.value.groupedData = grouped

    // 重新计算各城市区块的顶部位置
    nextTick(() => {
      getMenuItemTop()
    })

    paging.value?.complete([])
  }
</script>

<style lang="scss" scoped></style>
