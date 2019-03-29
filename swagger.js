var express = require('express');
var app = express();
var cors = require('cors');

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(cors());

productList = {};
categoryList = {};


class Image{
	constructor(name, dateMod, dateCreated, pixels, format){
		this.name = name;
		this.dateMod = dateMod;
		this.dateCreated = dateCreated;
		this.pixels = pixels;
		this.format = format;
	}
};

class Product{
	constructor(pName, pType, pBrand, pColors, pPrice, pStock, pState, pCategory){
		this.pName = pName;
		this.pType = pType;
		this.pBrand = pBrand;
		this.pColors = pColors;
		this.pPrice = pPrice;
		this.pStock = pStock;
		this.pState = pState;
		this.pCategory = pCategory;
		this.instanceList = [0];
	}
};

function getProduct(pName, pCategory, pBrand, pPrice){
	var pList = {};
	if(pName != null)	
		for(var key in productList)
			if(productList[key].pName.includes(pName))
				pList[key] = productList[key];
	if(Object.keys(productList).length <= 0)
		return(false);
	if(pCategory != null)
		for(var key in pList)
			if(categoryList[pList[key].pCategory].cName.contains(pCategory))
				delete pList[key];
	if(Object.keys(productList).length <= 0)
		return(false);
	if(pBrand != null)
		for(var key in pList)
			if(pList[key].pBrand != pBrand)
				delete pList[key];
	if(Object.keys(productList).length <= 0)
		return(false);
	if(pPrice != null)
		for(var key in pList)
			if(pList[key].pPrice > pPrice)
				delete pList[key];
	if(Object.keys(productList).length <= 0)
		return(false);
	else
		return(pList);
}
function postProduct(pId, pName, pType, pBrand, pColors, pPrice, pStock, pState, pCategory){
	if(productList[pId] != null){
		productList[pId].instanceList.push(productList[pId].instanceList.length);
		return(false);
	}
	else
		productList[pId] = new Product(pName, pType, pBrand, pColors, pPrice, pStock, pState, pCategory);
	return(true);
}
function putProduct(pId, pName, pType, pBrand, pColors, pPrice, pStock, pState, pCategory){
	if(productList[pId] == null)
		return(false);
	if(pCategory != null){
		categoryList[pCategory].pCount += 1;
		categoryList[productList[pId].pCategory].pCount-=1;
	}
	productList[pId].pName = pName || productList[pId].pName;
	productList[pId].pType = pType || productList[pId].pName;
	productList[pId].pBrand = pBrand || productList[pId].pName;
	productList[pId].pColors = pColors || productList[pId].pName;
	productList[pId].pPrice = pPrice || productList[pId].pName;
	productList[pId].pStock = pStock || productList[pId].pName;
	productList[pId].pState = pState || productList[pId].pName;
	productList[pId].pCategory = pCategory || productList[pId].pName;
	return(true);
}
function deleteProduct(pId){
	if(productList[pId] == null)
		return(false);
	categoryList[productList[pId].pCategory].pCount-=1;
	delete productList[pId];
	return(true);
}

class Category{
	constructor(cName, parent){
		this.cName = cName;
		this.pCount = 0;
		if(parent == null)
			this.parent = 0;
		else
			this.parent = parent;
	}
};

function getCategory(cId){
	if(cId != null){
		if(categoryList[cId] == null)
			return(false);
		return(categoryList[cId]);
	}
	var cList=[];
	for(var key in categoryList)
		cList.push(categoryList[key]+"; ");
	return(cList);
}
function postCategory(cId, cName, parent){
	if(categoryList[cId] != null)
		return(false);
	categoryList[cId] = new Category(cName, parent);
	return(true);
}
function putCategory(cId, cName, parent){
	if(categoryList[cId] == null)
		return(false);
	categoryList[cId].cName = cName || categoryList[cId].cName;
	categoryList[cId].parent = parent || categoryList[cId].parent;
	return(true);
}
function deleteCategory(cId){
	if(categoryList[cId] == null)
		return(false);
	delete categoryList[cId];
	delProducts(cId);
	return(true);
}

app.get('/product', (req, res)=>{
	var q = req.query;
	if(val = getProduct(q.pName, q.pCategory, q.pBrand, q.pPrice))
		res.status(200).send(val);
	res.status(404).send('Not found');
});

app.post('/product', (req, res)=>{
	var q = req.body;
	console.log(q);
	if(postProduct(q.pId, q.pName, q.pType, q.pBrand, q.pColors, q.pPrice, q.pStock, q.pState, q.pCategory))
		res.status(201).send('Created');
	else
		res.status(200).send('Added');
});

app.put('/product', (req, res)=>{
	var q = req.body;
	if(putProduct(q.pId, q.pName, q.pType, q.pBrand, q.pColors, q.pPrice, q.pStock, q.pState, q.pCategory))
		res.status(200).send('Updated');
	else
		res.status(404).send('Not found');
});

app.delete('/product', (req, res)=>{
	if(deleteProduct(req.query.pId))
		res.status(200).send("Deleted");
	else
		res.status(404).send("Not found");
});


app.get('/category', (req, res)=>{
	if(val = getCategory(req.query.cId))
		res.status(200).send(val);
	else
		res.status(404).send("Not found");
});

app.post('/category', (req, res)=>{
	var q = req.body;
	if(postCategory(q.cId, q.cName, q.parent))
		res.status(201).send("Created");
	else
		res.status(409).send("Already exists");
});

app.put('/category', (req, res)=>{
	var q = req.query.cInfo;
	if(putCategory(q.cId, q.cName, q.parent))
		res.status(200).send("Updated");
	else
		res.status(404).send("Not found");
});

app.delete('/category', (req, res)=>{
	if(deleteCategory(req.query.cId))
		res.status(202).send("Deleting");
	else
		res.status(404).send("Not found");
});

app.listen(3000);