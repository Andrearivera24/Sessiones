import { Router } from "express";
import productService from "../dao/services/product.service.js";
import { productModel } from "../dao/models/product.model.js";

const productRouter = Router();

//---------- CRUD----------

// C: create
productRouter.post("/", async (req, res) => {
  const product = await productService.addProduct(req.body);
  try {
    res.status(201).send(product);
  } catch (err) {
    res.status(404).send({ ERROR: err });
  }
});

// R: read //
productRouter.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; //devuelve 10 por defecto.
  const page = parseInt(req.query.page) || 1; // devuelve 1 página por defecto.
  const status = req.query.status; // true o false
  const category = req.query.category; // beginner || intermediate || advanced
  const sort = req.query.sort; // 1 o -1
  try { 
    const pagedProducts = await productModel.paginate(
      { status, category},
      { limit, page, sort: { price : sort } }
    );
    console.log(pagedProducts);
    res.send(pagedProducts);
  } catch (err) {
    res.status(500).send({ ERROR: err });
  }
});
// productRouter.get("/", async (req, res) => {
//   const products = await productService.getProducts();
//   const limit = parseInt(req.query.limit);
//   const page = parseInt(req.query.page);
//   const isAviable = req.query.isAviable; // true o false
//   const category = req.query.category; // beginner || intermediate || advanced
//   const sort = req.query.sort; // 1 o -1
//   try {
//     if (!limit && !page && !isAviable && !category && !sort) {
//       res.send(products);
//     } else if (limit) {
//       const limitedProducts = await productModel.aggregate([{ $limit: limit }]);
//       res.send(limitedProducts);
//     } else if (page) {
//       const pagedProducts = await productModel.paginate({}, { page: page });
//       res.send(pagedProducts);
//     } else if (isAviable == "true") {
//       const aviableProducts = await productModel.aggregate([
//         { $match: { status: !!isAviable } },
//       ]);
//       res.send(aviableProducts);
//     } else if (isAviable == "false") {
//       const aviableProducts = await productModel.aggregate([
//         { $match: { status: !isAviable } },
//       ]);
//       res.send(aviableProducts);
//     } else if (category) {
//       const prodByCategory = await productModel.aggregate([
//         { $match: { category: category } },
//       ]);
//       res.send(prodByCategory);
//     } else if (sort == 1) {
//       const sortedAscProducts = await productModel.aggregate([
//         { $sort: { price: 1 } },
//       ]);
//       res.send(sortedAscProducts);
//     } else if (sort == -1) {
//       const sortedDesProducts = await productModel.aggregate([
//         { $sort: { price: -1 } },
//       ]);
//       res.send(sortedDesProducts);
//     }
//   } catch (err) {
//     res.status(500).send({ ERROR: err });
//   }
// });

// U: update
productRouter.put("/:pid", async (req, res) => {
  const pid = req.params.pid;
  const products = await productService.updateProduct(pid, req.body);
  try {
    res.status(201).send(products);
  } catch (err) {
    res.status(500).send({ ERROR: err });
  }
});
// D: delete
productRouter.delete("/:pid", async (req, res) => {
  const pid = req.params.pid;
  const products = await productService.deleteProduct(pid);
  try {
    res.status(204).send(products);
  } catch (err) {
    res.status(500).send({ ERROR: err });
  }
});

export default productRouter;
