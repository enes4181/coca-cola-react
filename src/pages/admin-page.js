import BrandManagement from "../admin/brand-management";
import ProductManagement from "../admin/product-management";
import ProductTypeManagement from "../admin/product-type-management";

const Admin = () => {
    return (
        <>
            <BrandManagement />
            <ProductTypeManagement />
            <ProductManagement />
        </>
    );
};

export default Admin;