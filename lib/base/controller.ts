import { Controller, Context } from 'egg';
import routerDecorator from '../router';
import { Brackets } from 'typeorm';

// 分页参数配置
interface PageOp {
  // 模糊查询字段
  keywordLinkFields?: string[],
  where?: Brackets;
  // 全匹配字段
  fieldEq?: string[];
  // 排序
  addOrderBy?: {};
}

// 返回参数配置
interface ResOp {
  // 返回数据
  data?: any;
  // 是否成功
  success?: boolean;
  // 返回码
  code?: number;
  // 返回消息描述
  message?: string;
}

export abstract class  BaseController extends Controller {
  protected entity;
  protected OpService;
  protected pageOpton: PageOp;

  protected constructor (ctx: Context) {
    super(ctx);
    this.OpService = this.service.comm.data;
  }

  /**
   * 设置服务
   * @param service
   */
  protected setService (service) {
    this.OpService = service;
  }

  /**
   * 配置分页查询
   * @param option
   */
  protected setPageOption (option: PageOp) {
    this.pageOpton = option
  }

  /**
   * 设置操作实体
   * @param entity
   */
  protected setEntity (entity) {
    this.entity = entity;
  }

  /** 
   * 分页查询数据
   */
  @routerDecorator.get('/page')
  protected async page () {
    const result = await this.OpService.page(this.ctx.query, this.pageOpton, this.entity);
    this.res({ data: result });
  }

  /**
   * 获取列表
   */
  @routerDecorator.get('/list')
  protected async list () {
    const result = await this.OpService.list(this.entity);
    this.res({ data: result })
  }

  /**
   * 获取详情
   */
  @routerDecorator.get('/info')
  protected async info () {
    const result = await this.OpService.info(this.ctx.query.id, this.entity);
    this.res({ data: result })
  }

  /** 
   * 新增
   */
  @routerDecorator.post('/add')
  protected async add () {
    await this.OpService.add(this.ctx.request.body, this.entity);
    this.res({ data: { result: true } });
  }

  /**
   * 更新单个
   */
  @routerDecorator.post('/update')
  protected async update () {
    await this.OpService.update(this.ctx.request.body, this.entity);
    this.res({ data: { result: true } });
  }

  /**
   * 删除多个
   */
  @routerDecorator.post('/delete')
  protected async delete () {
    await this.OpService.delete(this.ctx.request.body.ids, this.entity);
    this.res({ data: { result: true }})
  }

  /**
   * 返回数据
   * @param op 返回结果，返回失败需要单独配置
   */
  protected res (op?: ResOp) {
    const { ctx } = this;
    if (!op || !op.success) {
      ctx.body = {
        code: op? op.code || 1001 : 10001,
        data: op? op.data || {} : {},
        message: op? op.message || 'fail' : 'fail'
      }
      return
    }
    ctx.body = {
      code: op.code || 1000,
      message: op.message || 'success',
      data: op.data || {}
    }
  }
 }