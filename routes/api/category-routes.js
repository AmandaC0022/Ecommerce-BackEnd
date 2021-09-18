const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

//GETS all Categories 
router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll();
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GETS specific Category by ID 
router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      // Joins with the Product module
      include: [{ model: Product }]
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      category_name: 'Dresses',
    }
  */
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update category data 
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((category) => {
      // find all Category Ids that match the params id 
      return Category.findAll({ where: { id: req.params.id } });
    })
    .then((categories) => {
      // get list of current category_ids
      // const categoryIDs = categories.map(({ category_id }) => id);
      // create filtered list of new category_ids
      const newCategory = req.body.categories
        .filter((category_id) => !categories.includes(category_id))
        .map((category_id) => {
          return {
            id: req.params.id,
            category_id,
          };
        });
      // figure out which ones to remove
      const categoriesToRemove = categories
        .filter(({ category_id }) => !req.body.categoryIDs.includes(category_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: categoriesToRemove } }),
        ProductTag.bulkCreate(newCategory),
      ]);
    })
    .then((updatedCategories) => res.json(updatedCategories))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// router.put('/:id', (req, res) => {
//   // update a category by its `id` value
// });

router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
