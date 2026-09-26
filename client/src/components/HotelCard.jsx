import { Card, Image, Text, Button, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";
function HotelCard({ hotel, onEdit, onDelete }) {
  const navigate = useNavigate();
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
  src={`http://localhost:5000${hotel.image}`}
  height={180}
  alt={hotel.title}
/>
      </Card.Section>
      <Text fw={700} size="lg" mt="md">
        {hotel.title}
      </Text>
      <Text fw={600} mt="xs">
        ₹{hotel.price}
      </Text>
      <Text size="sm" c="dimmed" mt="xs">
        {hotel.description}
      </Text>
      <Group
  mt="md"
  wrap="wrap"
>
  <Button
    onClick={() => navigate(`/hotel/${hotel.id}`)}
  >
    View Details
  </Button>

  <Button onClick={() => onEdit(hotel)}>
    Edit
  </Button>

  <Button
    color="red"
    variant="outline"
    onClick={() => onDelete(hotel.id)}
  >
    Delete
  </Button>
</Group>
    </Card>
  );
}
export default HotelCard;