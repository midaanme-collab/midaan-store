import React from 'react';
import { SHARED_PRODUCTS, isHelmetProduct, isPosterProduct } from '@/constants/products';
import { notFound } from 'next/navigation';
import ProductDetailView from '@/components/ProductDetailView';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return [
    { id: 'drop-helmet-white' },
    { id: 'drop-poster-white' },
    { id: 'keffiyeh-helmet-tee' },
    { id: 'palestine-poster-tee' },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  let product = SHARED_PRODUCTS.find((p) => p.id === id || p.slug === id);
  if (!product) {
    if (isHelmetProduct(id)) product = SHARED_PRODUCTS[0];
    else if (isPosterProduct(id)) product = SHARED_PRODUCTS[1];
  }
  if (!product) return {};

  const title = `${product.titleAr} / ${product.titleEn} | ميدان`;
  const desc = `${product.descriptionAr} — إصدار محدود من ميدان وصوت وصورة.`;
  const canonicalUrl = `https://midaan-store.midaanme.workers.dev/products/${product.id}`;
  const imgUrl = product.images[0] || '/helmet-back-white.jpg';

  return {
    title,
    description: desc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: desc,
      url: canonicalUrl,
      siteName: 'ميدان | Midaan',
      images: [
        {
          url: imgUrl,
          width: 1200,
          height: 1200,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [imgUrl],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product = SHARED_PRODUCTS.find((p) => p.id === id || p.slug === id);
  if (!product) {
    if (isHelmetProduct(id)) product = SHARED_PRODUCTS[0];
    else if (isPosterProduct(id)) product = SHARED_PRODUCTS[1];
  }
  if (!product) return notFound();

  return <ProductDetailView product={product} />;
}
