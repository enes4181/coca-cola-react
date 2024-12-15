import React, { useState, useEffect, useCallback } from 'react';
import { Container, Grid, Typography, IconButton, Divider, Box, TextField, Checkbox, Button } from '@mui/material';
import { Favorite, FavoriteBorder, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Autocomplete } from '@mui/material';
import { productService } from '../api/product';
import { productTypeService } from '../api/product-type';
import { brandService } from '../api/brand';
import {StyledCard, StyledCardMedia, StyledCardContent, FavoriteIconStyled} from '../components/style/home-page';
import useSnackbar from '../components/utils/message';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filter, setFilter] = useState({ brand: [], type: [] });
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const { errorMessage, SnackbarComponent } = useSnackbar();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const API_URL = process.env.REACT_APP_API_URL
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      const response = await productService.getAllProducts();
      setProducts(response?.data || []);
      const initialImageIndex = {};
      response?.data.forEach(product => {
        initialImageIndex[product._id] = 0;
      });
      setCurrentImageIndex(initialImageIndex);
    } catch (error) {
      errorMessage('Error fetching products:', error);
    }
  }, [errorMessage]);

  const fetchProductTypes = useCallback(async () => {
    try {
      const response = await productTypeService.getAllProductTypes();
      setProductTypes(response?.data || []);
    } catch (error) {
      errorMessage('Error fetching product types:', error);
    }
  }, [errorMessage]);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await brandService.getAllBrands();
      setBrands(response?.data || []);
    } catch (error) {
      errorMessage('Error fetching brands:', error);
    }
  }, [errorMessage]);

  useEffect(() => {
    fetchProducts();
    fetchProductTypes();
    fetchBrands();
  }, [fetchProducts, fetchProductTypes, fetchBrands]);

  const handleFilterChange = (event, value, reason, name) => {
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value.map((item) => item._id) }));
  };

  const handleFavoriteToggle = (product) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(product)
        ? prevFavorites.filter((fav) => fav !== product)
        : [...prevFavorites, product]
    );
  };

  const handleShowFavoritesToggle = () => {
    setShowFavorites((prevShowFavorites) => !prevShowFavorites);
  };

  const handleNextImage = (productId) => {
    const product = products.find((product) => product._id === productId);
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => ({
        ...prevIndex,
        [productId]: (prevIndex[productId] + 1) % product.images.length,
      }));
    }
  };

  const handlePrevImage = (productId) => {
    const product = products.find((product) => product._id === productId);
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => ({
        ...prevIndex,
        [productId]: (prevIndex[productId] - 1 + product.images.length) % product.images.length,
      }));
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const filteredProducts = products.filter((product) => {
    if (showFavorites && !favorites.includes(product)) {
      return false;
    }
    return (
      (filter.brand.length === 0 || filter.brand.includes(product.brandId)) &&
      (filter.type.length === 0 || filter.type.includes(product.productTypeId))
    );
  });

  return (
    <Container style={{ backgroundColor: '#ebebeb', padding: '20px', borderRadius: '8px' }}>
      <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
        Products
      </Typography>
      <Box style={{ backgroundColor: '#dcdcdc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              multiple
              options={brands}
              getOptionLabel={(option) => option.name}
              value={brands.filter((brand) => filter.brand.includes(brand._id))}
              onChange={(event, value, reason) => handleFilterChange(event, value, reason, 'brand')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Brand"
                  placeholder="Select brands"
                  size="small"
                  style={{ backgroundColor: '#ebebeb' }}
                />
              )}
              renderOption={(props, option, { selected }) => (
                <li key={option._id} {...props}>
                  <Checkbox
                    icon={<FavoriteBorder />}
                    checkedIcon={<Favorite />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.name}
                </li>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              multiple
              options={productTypes}
              getOptionLabel={(option) => option.name}
              value={productTypes.filter((type) => filter.type.includes(type._id))}
              onChange={(event, value, reason) => handleFilterChange(event, value, reason, 'type')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Type"
                  placeholder="Select types"
                  size="small"
                  style={{ backgroundColor: '#ebebeb' }}
                />
              )}
              renderOption={(props, option, { selected }) => (
                <li key={option._id} {...props}>
                  <Checkbox
                    icon={<FavoriteBorder />}
                    checkedIcon={<Favorite />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.name}
                </li>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <IconButton
              aria-label="favorite"
              onClick={handleShowFavoritesToggle}
              size="large"
              style={{ marginTop: '16px', marginLeft: '8px', backgroundColor: '#ebebeb', borderRadius: '8px' }}
            >
              {showFavorites ? <Favorite color="secondary" style={{ fontSize: '2rem' }} /> : <FavoriteBorder style={{ fontSize: '2rem' }} />}
            </IconButton>
          </Grid>
          {user?.role === 'admin' && (
          <Grid item xs={12} sm={4} md={4}>
             <Button variant="contained" color="primary" href="/admin">
          Admin Panel
        </Button>
          </Grid>
          )}
        </Grid>

      </Box>
      <Grid container spacing={4} style={{ marginTop: '20px' }}>
        {filteredProducts.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={3}>
            <StyledCard onClick={() => handleProductClick(product._id)} style={{ cursor: 'pointer' }}>
              <FavoriteIconStyled
                className="favorite-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavoriteToggle(product);
                }}
                color={favorites.includes(product) ? 'secondary' : 'default'}
              >
                {favorites.includes(product) ? <Favorite /> : <FavoriteBorder />}
              </FavoriteIconStyled>
              <StyledCardMedia
                component="img"
                src={`${API_URL}uploads/${product.images[currentImageIndex[product._id] || 0]}`} // Assuming product has an images array
                alt={product.name}
              />
              <IconButton
                className="arrow prev-arrow"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage(product._id);
                }}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '10px',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  display: 'none',
                  '&:hover': {
                    display: 'block',
                  },
                }}
              >
                <ArrowBackIos />
              </IconButton>
              <IconButton
                className="arrow next-arrow"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage(product._id);
                }}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  display: 'none',
                  '&:hover': {
                    display: 'block',
                  },
                }}
              >
                <ArrowForwardIos />
              </IconButton>
              <div style={{ height: '2.5%' }}></div> {/* Boşluk ekledik */}
              <Divider style={{ margin: '0 0' }} /> {/* Çizgiyi tamamladık */}
              <div style={{ height: '2.5%' }}></div> {/* Boşluk ekledik */}
              <StyledCardContent>
                <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                  <Typography variant="body2" style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#ff5722' }}>
                    {product.productTypeName}
                  </Typography>
                  <Typography variant="body2" style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#4caf50' }}>
                    {product.brandName}
                  </Typography>
                </div>
                <Typography variant="body2" color="primary" style={{ fontSize: '0.875rem', position: 'absolute', bottom: '10px', right: '10px' }}>
                  {product.name}
                </Typography>
              </StyledCardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      {SnackbarComponent}
    </Container>
  );
};

export default Home;