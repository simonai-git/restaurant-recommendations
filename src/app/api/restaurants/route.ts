import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/restaurants - List all restaurants
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const cuisineType = searchParams.get('cuisine')
    
    const where = cuisineType ? { cuisineType } : {}
    
    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.restaurant.count({ where })
    ])
    
    return NextResponse.json({
      restaurants,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + restaurants.length < total
      }
    })
  } catch (error) {
    console.error('Failed to fetch restaurants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    )
  }
}

// POST /api/restaurants - Create a new restaurant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const restaurant = await prisma.restaurant.create({
      data: {
        placeId: body.placeId,
        name: body.name,
        address: body.address,
        lat: body.lat,
        lng: body.lng,
        rating: body.rating,
        priceLevel: body.priceLevel,
        cuisineType: body.cuisineType,
        photos: body.photos || [],
        phone: body.phone,
        website: body.website,
        hours: body.hours
      }
    })
    
    return NextResponse.json(restaurant, { status: 201 })
  } catch (error) {
    console.error('Failed to create restaurant:', error)
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    )
  }
}
