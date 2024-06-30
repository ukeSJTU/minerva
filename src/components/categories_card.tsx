"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface Category {
  id: number;
  name: string;
  slug: string;
  _count: {
    posts: number;
  };
}

const CategoriesCard = () => {
  const [showAll, setShowAll] = useState(false);
  const [data, setData] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) => setData(data));
  }, []);

  const displayedCategories = showAll ? data : data.slice(0, 5);

  return (
    <Card className="w-[300px] p-4">
      <h2 className="text-xl font-bold mb-4 text-left">Categories</h2>
      <ul className="space-y-2">
        {displayedCategories.map((category) => (
          <li key={category.id} className="flex justify-between">
            <span>{category.name}</span>
            <span className="text-gray-500">{category._count.posts}</span>
          </li>
        ))}
      </ul>
      {data.length > 5 && !showAll && (
        <button
          className="mt-4 text-blue-500 hover:underline"
          onClick={() => setShowAll(true)}
        >
          Show more
        </button>
      )}
    </Card>
  );
};

export default CategoriesCard;
