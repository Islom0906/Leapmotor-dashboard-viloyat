import React from 'react';
import {RoutePermittedRole} from '../../shared/constants/AppEnums';

// const Map = React.lazy(() => import('./Map'));
// const MapPostEdit = React.lazy(() => import('./Map/MapPostEdit'));
const Product = React.lazy(() => import('./Product'));
const PostEditProduct = React.lazy(() => import('./Product/PostEditProduct'));
const Banner = React.lazy(() => import('./Banner'));
const PostEditBanner = React.lazy(() => import('./Banner/PostEditBanner'));
const Filial = React.lazy(() => import('./Filial'));
const PostEditFilial = React.lazy(() => import('./Filial/PostEditFilial'));
const FilialInner = React.lazy(() => import('./FilialInner'));
const PostEditFilialInner = React.lazy(() => import('./FilialInner/PostEditFilialInner'));
const Contact = React.lazy(() => import('./Contact'));
const PostEditContact = React.lazy(() => import('./Contact/ContactPostEdit'));
const News = React.lazy(() => import('./News'));
const NewsPostEdit = React.lazy(() => import('./News/NewsPostEdit'));
const About = React.lazy(() => import('./About'));
const AboutPostEdit = React.lazy(() => import('./About/PostEditAbout'));
// const Position = React.lazy(() => import('./Position'));
// const PostEditPosition = React.lazy(() => import('./Position/PositionPostEdit'));
// const Exterior = React.lazy(() => import('./Exterior'));
// const PostEditExterior = React.lazy(() => import('./Exterior/ExteriorPostEdit'));
// const Interior = React.lazy(() => import('./Interior'));
// const PostEditInterior = React.lazy(() => import('./Interior/InteriorPostEdit'));
// const Option = React.lazy(() => import('./Option'));
// const PostEditOption = React.lazy(() => import('./Option/OptionPostEdit'));
// const TestDrive = React.lazy(() => import('./TestDrive'));
// const Dealers = React.lazy(() => import('./Dealers'));
// const Dashboard = React.lazy(() => import('./Dashboard'));
// const Order = React.lazy(() => import('./Order'));
// const Region = React.lazy(() => import('./Region'));
// const PostEditRegion = React.lazy(() => import('./Region/RegionPostEdit'));
// const TgBotId = React.lazy(() => import('./TgBotId'));
// const PostEditTgBotId = React.lazy(() => import('./TgBotId/TgBotIdPostEdit'));



export const samplePagesConfigs = [
  // {
  //   permittedRole: RoutePermittedRole.user,
  //   path: '/dashboard',
  //   element: <Dashboard/>,
  // },
  // {
  //   permittedRole: RoutePermittedRole.user,
  //   path: '/testDrive',
  //   element: <TestDrive/>,
  // },
  // {
  //   permittedRole: RoutePermittedRole.user,
  //   path: '/order',
  //   element: <Order/>,
  // },
  // {
  //   permittedRole: RoutePermittedRole.user,
  //   path: '/dealers',
  //   element: <Dealers/>,
  // },
  // {
  //   permittedRole: RoutePermittedRole.user,
  //   path: '/map',
  //   element: <Map/>,
  // },
  // {
  //   permittedRole: RoutePermittedRole.user,
  //   path: '/map/add',
  //   element: <MapPostEdit />,
  // },

  {
    permittedRole: RoutePermittedRole.user,
    path: '/product',
    element: <Product />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/product/add',
    element: <PostEditProduct />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/banner',
    element: <Banner />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/banner/add',
    element: <PostEditBanner />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/filial',
    element: <Filial />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/filial/add',
    element: <PostEditFilial />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/filialInner',
    element: <FilialInner />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/filialInner/add',
    element: <PostEditFilialInner />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/contact/add',
    element: <PostEditContact />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/Contact',
    element: <Contact />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/news/add',
    element: <NewsPostEdit />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/news',
    element: <News />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/about/add',
    element: <AboutPostEdit />,
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/about',
    element: <About />,
  },
  // {
  //   permittedRole: RoutePermittedRole.user,
  //   path: '/position/add',
  //   element: <PostEditPosition />,
  // },
  // {
  //   permittedRole: RoutePermittedRole.user,
  //   path: '/position',
  //   element: <Position />,
  // },
  // {
  //   permittedRole: RoutePermittedRole.user,
  //   path: '/exterior/add',
  //   element: <PostEditExterior />,
  // },
  // {
  //   permittedRole: RoutePermittedRole.user,
  //   path: '/exterior',
  //   element: <Exterior />,
  // },
  // {
  //   permittedRole: RoutePermittedRole.user,
  //   path: '/interior/add',
  //   element: <PostEditInterior />,
  // },
  // {
  //   permittedRole: RoutePermittedRole.user,
  //   path: '/interior',
  //   element: <Interior />,
  // },
  // {
  //   permittedRole: RoutePermittedRole.user,
  //   path: '/option/add',
  //   element: <PostEditOption />,
  // },
  // {
  //   permittedRole: RoutePermittedRole.user,
  //   path: '/option',
  //   element: <Option />,
  // },
  // {
  //   permittedRole: RoutePermittedRole.user,
  //   path: '/region/add',
  //   element: <PostEditRegion/>,
  // },
  // {
  //   permittedRole: RoutePermittedRole.user,
  //   path: '/region',
  //   element: <Region />,
  // },
  // {
  //   permittedRole: RoutePermittedRole.user,
  //   path: '/tgbot/add',
  //   element: <PostEditTgBotId/>,
  // },
  // {
  //   permittedRole: RoutePermittedRole.user,
  //   path: '/tgbot',
  //   element: <TgBotId />,
  // },
];
