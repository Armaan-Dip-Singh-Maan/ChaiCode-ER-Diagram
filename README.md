# ChaiCode-ER-Diagram

Interactive ER diagram for an **Instagram Thrift & Handmade Store** database: nine entities, eight relationships, order management and product catalog layers.

Built with React (see `src/ERDiagram.jsx`). Run locally with `npm install` and `npm run dev`.

**Live site:** [https://er-diagram-viewer.vercel.app](https://er-diagram-viewer.vercel.app)

## Screenshots

### Order management layer

Customer, Order, Payment, OrderItem, and Shipping with relationships (places, has payment, contains, ships via).

![Order management layer](docs/images/01-order-management-layer.png)

### Design notes and entity summary

Design rationale cards and the full entity summary table.

![Design notes and entity summary](docs/images/02-design-notes-and-entity-summary.png)

### Product catalog layer

Product with ThriftedDetail, HandmadeDetail, and Inventory extensions.

![Product catalog layer](docs/images/03-product-catalog-layer.png)
