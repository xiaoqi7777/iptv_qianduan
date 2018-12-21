<template>
  <section class="demand-wrapper">
    <div class="tool_title">
      <span>点播列表</span>
    </div>
    <div>
			<el-form :inline="true" ref="filters" class="demo-form-inline toolbar" :model="filters">
        <el-form-item>
          <el-input v-model="filters.programName" placeholder="节目名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.programType">
            <el-option v-for="item in typeList" :key="item.value" 
              :value="item.value"
              :label="item.label"></el-option>
          </el-select>
        </el-form-item>
				<el-form-item>
					<el-button class="device_toolbtn device_search" @click="getDemandList"></el-button>
				</el-form-item>
			</el-form>
		</div>
    <div class="table_wrapper">
      <el-table 
        :data="tableData"
        stripe
        class="table_list">
        <el-table-column 
          prop="programName"
          label="节目名称"
          align="center"
          width="340"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column 
          prop="programType"
          label="节目类型"
          align="center"
          width="340"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.programType | typeFormate}}
          </template>
        </el-table-column>
        <el-table-column 
          label="最后更新时间"
          prop="updatedAt"
          align="center"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column 
          label="操作"
          align="center"
          width="180">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button size="small" class="table_list_btn table_edit" @click="getEdit(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        layout="prev, pager, next"
        :total="totalPage"
      >
      </el-pagination>
    </div>
  </section>
</template>

<script>
export default {
  name: 'demand',
  mounted() {
    this.getDemandList ()
  },
  filters: {
    typeFormate: function (val) {
      switch (val) {
        case '0':
          return '电影'
        break;
        case '1':
          return '电视剧'
        break;
      }
    }
    },
  data () {
    return {
      filters: {
        programName: '',
        programType: ''
      },
      typeList: [
        {
          label: "全部",
          value: ''
        },
        {
          label: "电影",
          value: '0'
        },
        {
          label: "电视剧",
          value: '1'
        }
      ],
      tableData: [],
      currentPage: 1,
      totalPage: 1
    }
  },
  methods: {
    // 查询点播列表
    getDemandList () {
      let status = false, params = {
          current_page: this.currentPage
        }
        for(let value of Object.values(this.filters)) {
          if(value !== '') {
            status = true;
            break;
          }
        }
        if(status) {
          Object.assign(params, this.filters)
          params.current_page = 1
          this.axio.post(`vod/list`, params)
          .then((response) => {
            if(response.data.ret.code === 0) {
              this.currentPage = 1
              this.totalPage = response.data.data.total
              this.tableData = response.data.data.res
            }
          })
        }else {
          this.axio.post(`vod/list`, params)
          .then((response) => {
            if(response.data.ret.code === 0) {
              this.totalPage = response.data.data.total
              this.tableData = response.data.data.res
            }
          })
        }
    },

    handleCurrentChange (val) {
      this.currentPage = val
      this.getDemandList ()
    },

    getEdit () {

    }
  },
}
</script>