import { FilterQuery, Query, Model } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(
    private readonly model: Model<T>,
    query: Record<string, unknown>
  ) {
    this.model = model;
    this.query = query;
    this.modelQuery = this.model.find({});
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: 'i' },
        })),
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Handle price range filters
    if (queryObj.minPrice || queryObj.maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (queryObj.minPrice) {
        priceFilter.$gte = Number(queryObj.minPrice);
        delete queryObj.minPrice;
      }
      if (queryObj.maxPrice) {
        priceFilter.$lte = Number(queryObj.maxPrice);
        delete queryObj.maxPrice;
      }
      queryObj.basePrice = priceFilter;
    }

    // Handle category filter
    if (queryObj.category) {
      queryObj.category = queryObj.category;
    }

    // Handle status filters
    if (queryObj.status) {
      queryObj['status.visibility'] = queryObj.status;
      delete queryObj.status;
    } else {
      // By default, show only public and active products
      queryObj['status.visibility'] = 'public';
      queryObj['status.isActive'] = true;
    }

    // Handle vendor filter
    if (queryObj.vendorId) {
      queryObj['sellers.vendorId'] = queryObj.vendorId;
      delete queryObj.vendorId;
    }

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }

  sort() {
    const sort = (this.query.sort as string)?.split(',').join(' ') || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const fields = (this.query.fields as string)?.split(',').join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  populate() {
    this.modelQuery = this.modelQuery
      .populate('category')
      .populate('sellers.vendorId');
    return this;
  }

  async execute() {
    return await this.modelQuery;
  }

  async countTotal() {
    const totalQuery = this.model.find(this.modelQuery.getFilter());
    const total = await totalQuery.countDocuments();
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPages
    };
  }
}

export default QueryBuilder;
