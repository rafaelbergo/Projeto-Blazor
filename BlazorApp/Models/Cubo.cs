namespace BlazorApp.Models
{
    public class Cubo{
            public Guid Id { get; set; } = Guid.NewGuid();
            public required string Name { get; set; }
            public string? Description { get; set; }
            public required double X { get; set; }
            public required double Y { get; set; }
            public required double Z { get; set; }
            public double? RotX { get; set; }
            public double? RotY { get; set; }
            public double? RotZ { get; set; }
            public double? Scale { get; set; }

            public Cubo() {}
        }
}