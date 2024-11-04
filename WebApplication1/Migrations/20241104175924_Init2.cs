using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class Init2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApprovedDate",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "FinalizedDate",
                table: "Requests");

            migrationBuilder.AddColumn<string>(
                name: "EmployeeEmail",
                table: "Requests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EmployeeName",
                table: "Requests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmployeeEmail",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "EmployeeName",
                table: "Requests");

            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovedDate",
                table: "Requests",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FinalizedDate",
                table: "Requests",
                type: "datetime2",
                nullable: true);
        }
    }
}
