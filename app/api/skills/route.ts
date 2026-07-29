// app/api/skills/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Skill from "@/models/Skill";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SKILL_CATEGORIES } from "@/lib/skillCategories";

export async function GET() {
  try {
    await connectToDatabase();
    const skills = await Skill.find({}).sort({ category: 1, order: 1 });
    return NextResponse.json(skills, { status: 200 });
  } catch (error) {
    console.error("GET /api/skills error:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log("=== POST /api/skills START ===");
    const session = await getServerSession(authOptions);
    console.log("Session:", session ? "Authenticated" : "Not authenticated");
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - No session" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const userRole = (session.user as any)?.role;
    console.log("User role:", userRole);
    
    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Connect to database
    await connectToDatabase();
    console.log("Database connected");

    // Parse request body
    const body = await req.json();
    console.log("Request body received:", JSON.stringify(body, null, 2));

    // Validate required fields
    const errors = [];
    if (!body.name) {
      errors.push("Skill name is required");
    }
    if (!body.category) {
      errors.push("Category is required");
    }
    if (!body.icon) {
      errors.push("Icon/SVG is required");
    }

    // Validate category enum
    if (body.category && !SKILL_CATEGORIES.includes(body.category)) {
      errors.push(`Category must be one of: ${SKILL_CATEGORIES.join(", ")}`);
    }

    // Validate percentage
    if (body.percentage !== undefined && body.percentage !== null && body.percentage !== "") {
      const percentageNum = Number(body.percentage);
      if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) {
        errors.push("Percentage must be between 0 and 100");
      }
    }

    if (errors.length > 0) {
      console.log("Validation errors:", errors);
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: errors,
          received: body 
        },
        { status: 400 }
      );
    }

    // Create new skill
    const skillData: any = {
      name: body.name.trim(),
      category: body.category.trim(),
      icon: body.icon.trim(),
      order: Number(body.order) || 0,
    };

    // Only include percentage if it exists and is valid
    if (body.percentage !== undefined && body.percentage !== null && body.percentage !== "") {
      skillData.percentage = Number(body.percentage);
    }

    // console.log("Final skill data to save:", JSON.stringify(skillData, null, 2));

    const newSkill = await Skill.create(skillData);
    // console.log("Skill created successfully:", newSkill._id);

    return NextResponse.json(
      {
        success: true,
        data: newSkill,
        message: "Skill added successfully",
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("=== POST /api/skills ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    if (error.code) {
      console.error("MongoDB error code:", error.code);
    }
    if (error.keyPattern) {
      console.error("Duplicate key:", error.keyPattern);
    }
    if (error.errors) {
      console.error("Validation errors:", JSON.stringify(error.errors, null, 2));
    }
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          error: "Skill already exists",
          field: Object.keys(error.keyPattern)[0]
        },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: validationErrors,
          fields: Object.keys(error.errors)
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to add skill",
        message: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
      },
      { status: 500 }
    );
  }
}

// PUT and DELETE methods remain the same...
// PUT - Update an existing skill
export async function PUT(req: Request) {
  try {
    console.log("=== PUT /api/skills START ===");
    
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - No session" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const userRole = (session.user as any)?.role;
    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Parse request body
    const body = await req.json();
    // console.log("Request body:", JSON.stringify(body, null, 2));

    // Validate _id
    const { _id, ...updateData } = body;
    if (!_id) {
      return NextResponse.json(
        { error: "Skill ID is required" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!updateData.name) {
      return NextResponse.json(
        { error: "Skill name is required" },
        { status: 400 }
      );
    }
    
    if (!updateData.category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }
    
    if (!SKILL_CATEGORIES.includes(updateData.category)) {
      return NextResponse.json(
        { 
          error: `Category must be one of: ${SKILL_CATEGORIES.join(", ")}`,
          received: updateData.category 
        },
        { status: 400 }
      );
    }
    
    if (!updateData.icon) {
      return NextResponse.json(
        { error: "Icon/SVG is required" },
        { status: 400 }
      );
    }

    // Prepare update data
    const preparedData: any = {
      name: updateData.name.trim(),
      category: updateData.category.trim(),
      icon: updateData.icon.trim(),
      order: Number(updateData.order) || 0,
    };

    // Only include percentage if it exists and is valid
    if (updateData.percentage !== undefined && updateData.percentage !== null && updateData.percentage !== "") {
      const percentageNum = Number(updateData.percentage);
      if (!isNaN(percentageNum) && percentageNum >= 0 && percentageNum <= 100) {
        preparedData.percentage = percentageNum;
      }
    }

    console.log("Update data:", JSON.stringify(preparedData, null, 2));

    // Find and update the skill
    const updatedSkill = await Skill.findByIdAndUpdate(
      _id,
      preparedData,
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validations
      }
    );

    if (!updatedSkill) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedSkill,
        message: "Skill updated successfully",
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("PUT /api/skills error:", error);

    // Handle duplicate key error (MongoDB)
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          error: "Skill already exists with this name",
          field: Object.keys(error.keyPattern)[0]
        },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: validationErrors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to update skill",
        message: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a skill
export async function DELETE(req: Request) {
  try {
    console.log("=== DELETE /api/skills START ===");
    
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - No session" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const userRole = (session.user as any)?.role;
    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Get ID from URL query parameter
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Skill ID is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find and delete the skill
    const deletedSkill = await Skill.findByIdAndDelete(id);

    if (!deletedSkill) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: deletedSkill,
        message: "Skill deleted successfully",
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("DELETE /api/skills error:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to delete skill",
        message: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
      },
      { status: 500 }
    );
  }
}