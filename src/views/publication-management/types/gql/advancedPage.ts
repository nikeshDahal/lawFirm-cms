import type { Except } from 'type-fest';

type Header = {
    id: string;
    title: string;
    slug: string;
    status: string;
    body: string;
};
type Banner = {
    id: string;
    image: string;
    alt: string;
    description: string;
    label: string;
    url: string;
};

type HomeBanner = {
    id: string;
    image: string;
    alt: string;
    label: string;
    heading: string;
    url: string;
};

type FeaturedProductsMetaSchema = {
    id: string;
    image: string;
    name: string;
    type: string;
};

type FeaturedProduct = {
    id: string;
    text: string;
    meta: FeaturedProductsMetaSchema[];
};

type ImageColumnMetaSchema = {
    id: string;
    image: string;
    align: string;
    main: string;
    sub: string;
};

type ImageColumn = {
    id: string;
    text: string;
    meta: ImageColumnMetaSchema[];
};

type StepsMetaSchema = {
    id: string;
    image: string;
    title: string;
    description: string;
};

type Steps = {
    id: string;
    text: string;
    meta: StepsMetaSchema[];
};

type Testimonials = {
    showTestimonials: Boolean;
    heading: string;
};

type SEO = {
    title: string;
    tags: string;
    description: string;
};

type FAQContentSchema = {
    _id: string;
    question: string;
    answer: string;
};

type FAQ = {
    showFaqs: Boolean;
};

type HomePageTemplate = {
    _id: string;
    title: string;
    slug: string;
    status: string;
    body: string;
    banner: Banner[];
    homeBanner: HomeBanner[];
    featuredProduct: FeaturedProduct[];
    imageColumn: ImageColumn;
    steps: Steps;
    seo: SEO;
    faq: FAQ;
    createdAt: Date;
    updatedAt: Date;
};

type Pagination = {
    total: number;
    hasNextPage: boolean;
};

export type GetHomePageTemplateDto = {
    searchText?: string;
    orderBy?: string;
    order?: string;
    limit?: number;
    skip?: number;
};

export type HomePageTemplateDto = {
    header: Header[];
    banner?: Banner[];
    homeBanner?: HomeBanner[];
    featuredProduct?: FeaturedProduct[];
    imageColumn?: ImageColumn[];
    steps?: Steps[];
    seo?: SEO[];
    faq?: FAQ[];
};

export type AdvancePageDto = {
    title: string;
    slug: string;
    status: string;
    content: string;
    seoTags?: SEO;
    banner?: Banner[];
    homePage?: HomeBanner[];
    featuredProducts?: FeaturedProduct[];
    imageColumn?: ImageColumn[];
    steps?: Steps[];
    faq?: FAQ;
    testimonials?: Testimonials;
};

type BaseResponse = {
    message: string;
    pagination: Pagination;
    templates: HomePageTemplate[];
    template: HomePageTemplate;
};

export type CreateHomePageResponse = { createHomePage: Except<BaseResponse, 'pagination' | 'templates'> };

export type CreateAdvancePageResponse = { createAdvancePage: Except<BaseResponse, 'pagination' | 'templates'> };

export type HomePageTemplateResponse = {
    removeHomePage: Except<BaseResponse, 'pagination' | 'template' | 'templates'>;
    getAllHomePageList: Except<BaseResponse, 'template'>;
    getHomePageList: Except<BaseResponse, 'pagination' | 'templates'>;
};


