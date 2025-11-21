import { Repository } from 'typeorm';

export class BaseService<Entity> {
  constructor(private readonly repository: Repository<Entity>) {}

  // TODO:...

  /**
   *
   * @method softDelete
   * @param {number | number[]}ids
   * @returns {Promise<boolean>}
   */
  async softDelete(ids: number | number[]): Promise<boolean> {
    const result = await this.repository.softDelete(ids);
    return !!result.affected;
  }

  /**
   *
   * @method restore
   * @param {number | number[]}ids
   * @returns {Promise<boolean>}
   */
  async restore(ids: number | number[]): Promise<boolean> {
    const result = await this.repository.restore(ids);
    return !!result.affected;
  }

  /**
   *
   * @method delete
   * @param {number | number[]}ids
   * @returns {Promise<boolean>}
   */
  async delete(ids: number | number[]): Promise<boolean> {
    const result = await this.repository.delete(ids);
    return !!result.affected;
  }
}
