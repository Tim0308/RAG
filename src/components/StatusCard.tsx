import { useState } from "react";
import { format } from "date-fns";
import { StatusBadge } from "./StatusBadge";
import { AlertCircle, MessageSquare, User, Edit2, Save, Trash2 } from "lucide-react";

interface StatusCardProps {
  date: string;
  status: "Green" | "Amber" | "Red";
  reporter: string;
  comment: string;
}

export const StatusCard = ({ date, status, reporter, comment }: StatusCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleEditClick = () => setIsEditing(true);
  const handleSaveClick = () => setIsEditing(false);
  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setIsDeleted(true);
    }
  };

  if (isDeleted) {
    return null; // Remove the card from display after deletion
  }

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md animate-fade-up">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <AlertCircle className="h-4 w-4" />
            {format(new Date(date), "MMM d, yyyy")}
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <p className="font-medium text-gray-900">{reporter}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>
      
      <div className="flex items-start gap-2 text-gray-700 leading-relaxed">
        <MessageSquare className="h-4 w-4 mt-1 text-gray-500 shrink-0" />
        {isEditing ? (
          <textarea
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
          />
        ) : (
          <p className="whitespace-pre-wrap">{editedComment || "No comment available."}</p>
        )}
      </div>

      {/* <div className="flex justify-end mt-4 space-x-2">
        {isEditing ? (
          <button
            className="flex items-center gap-2 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
            onClick={handleSaveClick}
          >
            <Save className="h-4 w-4" /> Save
          </button>
        ) : (
          <>
            <button
              className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              onClick={handleEditClick}
            >
              <Edit2 className="h-4 w-4" /> Edit
            </button>
            <button
              className="flex items-center gap-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </>
        )}
      </div> */}
    </div>
  );
};
