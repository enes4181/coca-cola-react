import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { productService } from "../api/product";
import { StyledCard, StyledCardContent, StyledCardMedia, StyledTypography } from "../components/style/product-detail";


const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const API_URL = process.env.REACT_APP_API_URL

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProductById(productId);
        setProduct(response?.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleNextImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % product.images.length
      );
    }
  };

  const handlePrevImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + product.images.length) % product.images.length
      );
    }
  };

  if (!product) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ebebeb",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <StyledCard
        variant="outlined"
        sx={{ position: "relative", width: "100%", height: "100%" }}
      >
        <Box sx={{ position: "relative", width: "50%", height: "100%" }}>
          <StyledCardMedia
            component="img"
            alt={product.name}
            image={`${API_URL}uploads/${product.images[currentImageIndex]}`}
          />
          <IconButton
            onClick={handlePrevImage}
            sx={{
              position: "absolute",
              top: "50%",
              left: "10px",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              zIndex: 1,
            }}
          >
            <ArrowBackIos />
          </IconButton>
          <IconButton
            onClick={handleNextImage}
            sx={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              zIndex: 1,
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </Box>
        <StyledCardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#333" }}
              >
                {product.brandName}
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#ff5722", marginLeft: "10px" }}
              >
                {product.productTypeName}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#4caf50",
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                }}
              >
                {product.name}
              </Typography>
            </Box>
            <StyledTypography
              variant="body2"
              color="text.secondary"
              gutterBottom
            >
            {product.description}
            </StyledTypography>
          </Box>
        </StyledCardContent>
      </StyledCard>
    </Container>
  );
};

export default ProductDetail;