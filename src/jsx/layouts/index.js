import Nav from './nav';
import Footer from './Footer';

const Layout = ({ children, isPublic }) => {
   if (isPublic) return children;

   return (
      <>
         <Nav />
         {children}
         <Footer />
      </>
   );
};

export default Layout;
