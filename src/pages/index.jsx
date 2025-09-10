import Layout from "./Layout.jsx";

import Home from "./Home";

import Animals from "./Animals";

import AnimalDetails from "./AnimalDetails";

import Shelters from "./Shelters";

import ShelterDetails from "./ShelterDetails";

import Events from "./Events";

import Community from "./Community";

import PostDetails from "./PostDetails";

import UserProfile from "./UserProfile";

import Blog from "./Blog";

import ArticleDetails from "./ArticleDetails";

import Shop from "./Shop";

import ShopList from "./ShopList";

import ProductDetails from "./ProductDetails";

import Donate from "./Donate";

import EventDetails from "./EventDetails";

import AdoptionForm from "./AdoptionForm";

import AdminDashboard from "./AdminDashboard";

import AdminMyShelter from "./AdminMyShelter";

import AdminManageAnimals from "./AdminManageAnimals";

import AdminAdoptionRequests from "./AdminAdoptionRequests";

import AdminMessages from "./AdminMessages";

import AdminSettings from "./AdminSettings";

import AdminManageEvents from "./AdminManageEvents";

import AdminDonations from "./AdminDonations";

import UserProfileData from "./UserProfileData";

import UserAdoptions from "./UserAdoptions";

import UserPosts from "./UserPosts";

import UserMessages from "./UserMessages";

import UserEvents from "./UserEvents";

import UserFavorites from "./UserFavorites";

import CommunityFeed from "./CommunityFeed";

import Services from "./Services";

import ServiceProviderDetails from "./ServiceProviderDetails";

import Terms from "./Terms";

import Privacy from "./Privacy";

import ServiceProviderApplication from "./ServiceProviderApplication";

import ShelterApplication from "./ShelterApplication";

import AdminUserManagement from "./AdminUserManagement";

import AdminDataExport from "./AdminDataExport";

import UserSettings from "./UserSettings";

import UserDonations from "./UserDonations";

import AdminMyService from "./AdminMyService";

import ServiceProviderDashboard from "./ServiceProviderDashboard";

import AdminEditUser from "./AdminEditUser";

import AdminManageShelters from "./AdminManageShelters";

import AdminEditShelter from "./AdminEditShelter";

import AdminEditAnimal from "./AdminEditAnimal";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Animals: Animals,
    
    AnimalDetails: AnimalDetails,
    
    Shelters: Shelters,
    
    ShelterDetails: ShelterDetails,
    
    Events: Events,
    
    Community: Community,
    
    PostDetails: PostDetails,
    
    UserProfile: UserProfile,
    
    Blog: Blog,
    
    ArticleDetails: ArticleDetails,
    
    Shop: Shop,
    
    ShopList: ShopList,
    
    ProductDetails: ProductDetails,
    
    Donate: Donate,
    
    EventDetails: EventDetails,
    
    AdoptionForm: AdoptionForm,
    
    AdminDashboard: AdminDashboard,
    
    AdminMyShelter: AdminMyShelter,
    
    AdminManageAnimals: AdminManageAnimals,
    
    AdminAdoptionRequests: AdminAdoptionRequests,
    
    AdminMessages: AdminMessages,
    
    AdminSettings: AdminSettings,
    
    AdminManageEvents: AdminManageEvents,
    
    AdminDonations: AdminDonations,
    
    UserProfileData: UserProfileData,
    
    UserAdoptions: UserAdoptions,
    
    UserPosts: UserPosts,
    
    UserMessages: UserMessages,
    
    UserEvents: UserEvents,
    
    UserFavorites: UserFavorites,
    
    CommunityFeed: CommunityFeed,
    
    Services: Services,
    
    ServiceProviderDetails: ServiceProviderDetails,
    
    Terms: Terms,
    
    Privacy: Privacy,
    
    ServiceProviderApplication: ServiceProviderApplication,
    
    ShelterApplication: ShelterApplication,
    
    AdminUserManagement: AdminUserManagement,
    
    AdminDataExport: AdminDataExport,
    
    UserSettings: UserSettings,
    
    UserDonations: UserDonations,
    
    AdminMyService: AdminMyService,
    
    ServiceProviderDashboard: ServiceProviderDashboard,
    
    AdminEditUser: AdminEditUser,
    
    AdminManageShelters: AdminManageShelters,
    
    AdminEditShelter: AdminEditShelter,
    
    AdminEditAnimal: AdminEditAnimal,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Animals" element={<Animals />} />
                
                <Route path="/AnimalDetails" element={<AnimalDetails />} />
                
                <Route path="/Shelters" element={<Shelters />} />
                
                <Route path="/ShelterDetails" element={<ShelterDetails />} />
                
                <Route path="/Events" element={<Events />} />
                
                <Route path="/Community" element={<Community />} />
                
                <Route path="/PostDetails" element={<PostDetails />} />
                
                <Route path="/UserProfile" element={<UserProfile />} />
                
                <Route path="/Blog" element={<Blog />} />
                
                <Route path="/ArticleDetails" element={<ArticleDetails />} />
                
                <Route path="/Shop" element={<Shop />} />
                
                <Route path="/ShopList" element={<ShopList />} />
                
                <Route path="/ProductDetails" element={<ProductDetails />} />
                
                <Route path="/Donate" element={<Donate />} />
                
                <Route path="/EventDetails" element={<EventDetails />} />
                
                <Route path="/AdoptionForm" element={<AdoptionForm />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/AdminMyShelter" element={<AdminMyShelter />} />
                
                <Route path="/AdminManageAnimals" element={<AdminManageAnimals />} />
                
                <Route path="/AdminAdoptionRequests" element={<AdminAdoptionRequests />} />
                
                <Route path="/AdminMessages" element={<AdminMessages />} />
                
                <Route path="/AdminSettings" element={<AdminSettings />} />
                
                <Route path="/AdminManageEvents" element={<AdminManageEvents />} />
                
                <Route path="/AdminDonations" element={<AdminDonations />} />
                
                <Route path="/UserProfileData" element={<UserProfileData />} />
                
                <Route path="/UserAdoptions" element={<UserAdoptions />} />
                
                <Route path="/UserPosts" element={<UserPosts />} />
                
                <Route path="/UserMessages" element={<UserMessages />} />
                
                <Route path="/UserEvents" element={<UserEvents />} />
                
                <Route path="/UserFavorites" element={<UserFavorites />} />
                
                <Route path="/CommunityFeed" element={<CommunityFeed />} />
                
                <Route path="/Services" element={<Services />} />
                
                <Route path="/ServiceProviderDetails" element={<ServiceProviderDetails />} />
                
                <Route path="/Terms" element={<Terms />} />
                
                <Route path="/Privacy" element={<Privacy />} />
                
                <Route path="/ServiceProviderApplication" element={<ServiceProviderApplication />} />
                
                <Route path="/ShelterApplication" element={<ShelterApplication />} />
                
                <Route path="/AdminUserManagement" element={<AdminUserManagement />} />
                
                <Route path="/AdminDataExport" element={<AdminDataExport />} />
                
                <Route path="/UserSettings" element={<UserSettings />} />
                
                <Route path="/UserDonations" element={<UserDonations />} />
                
                <Route path="/AdminMyService" element={<AdminMyService />} />
                
                <Route path="/ServiceProviderDashboard" element={<ServiceProviderDashboard />} />
                
                <Route path="/AdminEditUser" element={<AdminEditUser />} />
                
                <Route path="/AdminManageShelters" element={<AdminManageShelters />} />
                
                <Route path="/AdminEditShelter" element={<AdminEditShelter />} />
                
                <Route path="/AdminEditAnimal" element={<AdminEditAnimal />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}