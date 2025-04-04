import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/models/user.model.ts";
import { Organizer } from "@/models/organizer.model.ts";
import { getTagsFull } from "@/api/events.data.ts";
import { ImageUploadField } from "@/components/ImageUploadField";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu.tsx";
import { Filter, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import axios from "axios";

interface RegisterEditProps {
  isEditing: boolean; // Determines whether we are editing or registering a new user
}

const RegisterEdit: React.FC<RegisterEditProps> = ({ isEditing }) => {
  const { user, registerUser, updateUserAndOrganizer } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [organizerData, setOrganizerData] = useState<Organizer | undefined>(
    undefined
  );
  const [tagSearchTerm, setTagSearchTerm] = useState<string>(""); // Search input
  const [availableTags, setAvailableTags] = useState<
    { id: number; name: string }[]
  >([]); // Available tags
  const [selectedTags, setSelectedTags] = useState<
    { id: number; name: string }[]
  >([]); // Selected tags
  // const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]); // Store selected tag IDs
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing && user) {
      setEmail(user.email);
      setUsername(user.username);
      if (user.organizer) {
        setOrganizerData(user.organizer); // Populate organizer data if user is an admin
        if (user.organizer.orgTags) {
          console.log(
            "User is organizer with following tags: ",
            user.organizer.orgTags
          );
          const existingTags = user.organizer.orgTags.map(
            (orgTag) => orgTag.tag
          );
          setSelectedTags(existingTags);
        }
      }
    }
  }, [isEditing, user]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getTagsFull(tagSearchTerm); // Fetch from API
        console.log("Fetched Tags:", response.tags);
        setAvailableTags(response.tags); // Store the fetched tags
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };

    fetchTags();
  }, [tagSearchTerm]); // Runs whenever the user types

  const toggleTagSelection = (tag: { id: number; name: string }) => {
    setSelectedTags(
      (prevTags) =>
        prevTags.some((t) => t.id === tag.id)
          ? prevTags.filter((t) => t.id !== tag.id) // Remove if already selected
          : [...prevTags, tag] // Add if not selected
    );
  };

  const removeTag = (tagId: number) => {
    setSelectedTags((prevTags) => prevTags.filter((t) => t.id !== tagId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Image handling
      if (organizerData) {
        // TODO: Add loading state
        let uploadedImageUrl = organizerData?.imageUrl; // default to existing image (we don't want to overwrite if there is no uploaded image)
        console.log("Uploading image");
        if (selectedImage) {
          const formData = new FormData();
          formData.append("image", selectedImage);

          const uploadRes = await axios.post("/api/upload", formData);
          uploadedImageUrl = uploadRes.data.imageUrl;
          console.log("Image URL: ", uploadedImageUrl);
        }
        organizerData.imageUrl = uploadedImageUrl;
      }

      console.log("After uploading orgData:");
      console.log(organizerData);

      // UPDATE CASE
      if (isEditing && user) {
        // Update existing user
        const updatedUser: User = {
          ...user,
          email,
          username,
          passwordHash: user.passwordHash, // Do not change password
        };

        const selectedTagIds = selectedTags.map((tag) => tag.id); // Convert to IDs
        const response = await updateUserAndOrganizer(
          updatedUser,
          organizerData,
          selectedTagIds
        );
        if (response.success) {
          console.log("Updated user/organizer");
          setError("");
          setMessage("User successfully updated.");
          console.log("Before timeout navigation");
          // TODO: There's a bug that doesn't wait for 2 seconds before navigating, but only for organizer edits not user edits
          // Not sure what the issue is, but the update goes through successfully
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setError(response.message);
        }
      } else {
        // REGISTER CASE
        // TODO: Field validation on frontend side + Loading states
        // Register a new user
        const selectedTagIds = selectedTags.map((tag) => tag.id); // Convert to IDs
        const response = await registerUser(
          email,
          username,
          password,
          isAdmin,
          organizerData,
          selectedTagIds
        );

        if (response.success) {
          setError("");
          setMessage("User successfully registered. Please login to continue");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setError(response.message);
        }
      }
    } catch (error) {
      console.error(error);
      setError("Unknown error occured. Please try again.");
    }
  };

  // Explicitly handle `checked` state to ensure it's a boolean
  const handleIsAdminChange = (checked: boolean | "indeterminate") => {
    if (checked === "indeterminate") return;
    console.log(checked);
    setIsAdmin(checked as boolean); // cast to boolean to avoid type errors
  };

  return (
    <Card className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {isEditing ? "Edit Your Profile" : "Register a New Account"}
      </h2>
      {error && <p className="text-red-500 text-center p-4">{error}</p>}
      {message && <p className="text-green-500 text-center p-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <Label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {!isEditing && (
          <>
            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isAdmin}
                onCheckedChange={handleIsAdminChange}
                id="isAdmin"
              />
              <Label
                htmlFor="isAdmin"
                className="text-sm font-medium text-gray-700"
              >
                Register as organizer
              </Label>
            </div>
          </>
        )}

        {(isAdmin || user?.admin) && (
          <div className="mt-4 space-y-4">
            <h3 className="text-xl font-semibold">Organizer Details</h3>

            <div>
              <Label
                htmlFor="organizerName"
                className="block text-sm font-medium text-gray-700"
              >
                Organizer Name
              </Label>
              <Input
                id="organizerName"
                type="text"
                value={organizerData?.name || ""}
                onChange={(e) =>
                  setOrganizerData({ ...organizerData!, name: e.target.value })
                }
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="organizerInfo"
                className="block text-sm font-medium text-gray-700"
              >
                Organizer Info
              </Label>
              <Textarea
                id="organizerInfo"
                value={organizerData?.info || ""}
                onChange={(e) =>
                  setOrganizerData({ ...organizerData!, info: e.target.value })
                }
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <Label
                htmlFor="organizerEmail"
                className="block text-sm font-medium text-gray-700"
              >
                Organizer Email
              </Label>
              <Input
                id="organizerEmail"
                type="email"
                value={organizerData?.email || ""}
                onChange={(e) =>
                  setOrganizerData({ ...organizerData!, email: e.target.value })
                }
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <Label
                htmlFor="organizerPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Organizer Phone
              </Label>
              <Input
                id="organizerPhone"
                type="text" // TODO: Change to number
                value={organizerData?.phone || ""}
                onChange={(e) =>
                  setOrganizerData({ ...organizerData!, phone: e.target.value })
                }
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* <div>
              <Label
                htmlFor="organizerImage"
                className="block text-sm font-medium text-gray-700"
              >
                Organizer Image URL
              </Label>
              <Input
                id="organizerImage"
                type="text"
                value={organizerData?.imageUrl || ""}
                onChange={(e) =>
                  setOrganizerData({
                    ...organizerData!,
                    imageUrl: e.target.value,
                  })
                }
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div> */}
            <ImageUploadField onFileSelect={(file) => setSelectedImage(file)} />
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Tags
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2">
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search tags..."
                        className="pl-10"
                        value={tagSearchTerm}
                        onChange={(e) => setTagSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Show "No tags found" if there are no available tags */}
                    {availableTags.length === 0 ? (
                      <p className="text-muted-foreground text-sm p-2">
                        No tags found
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {availableTags.map((tag) => (
                          <Badge
                            key={tag.id}
                            variant={
                              selectedTags.some((t) => t.id === tag.id)
                                ? "secondary"
                                : "outline"
                            }
                            className="cursor-pointer hover:bg-secondary"
                            onClick={() => toggleTagSelection(tag)}
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedTags.map((tag) => (
                <Badge key={tag.id} className="gap-1">
                  {tag.name}
                  <Button
                    variant="ghost"
                    className="w-3 h-3"
                    onClick={() => removeTag(tag.id)}
                  >
                    <X className="h-3 w-3 cursor-pointer" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <Button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEditing ? "Update Profile" : "Register"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default RegisterEdit;
