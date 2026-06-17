import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { GridDistro } from "./types/types";
import Link from "next/link";
import { CompareToggleButton } from "./compare-toggle-button";

export const DistroCard = (props: GridDistro & { priority?: boolean }) => {
  const { name, description, tags, img, slug, imgFit = "cover", priority = false } = props;
  const isContain = imgFit === "contain";

  return (
    <Link href={`/distros/${slug}`} className="h-full w-full transition-transform hover:scale-98">
      <Card className="relative flex h-full w-full flex-col overflow-hidden pt-0">
        <div className="relative aspect-video w-full overflow-hidden">
          {isContain && (
            <div
              className="absolute inset-0 scale-110 bg-cover bg-center opacity-40 blur-xl"
              style={{ backgroundImage: `url(${img || "/placeholder.png"})` }}
            />
          )}
          <Image
            className={`relative z-20 h-full w-full ${isContain ? "object-contain" : "object-cover"}`}
            src={img || "/placeholder.png"}
            alt={name}
            title={name}
            width={800}
            height={450}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={75}
            priority={priority}
          />
          <div className="absolute top-2 right-2 z-30">
            <CompareToggleButton slug={slug} name={name} img={img} />
          </div>
        </div>

        <CardHeader className="flex-1">
          <CardTitle>{name}</CardTitle>
          <CardDescription className="line-clamp-3">{description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
};
