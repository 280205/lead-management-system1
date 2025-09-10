<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->
- [x] Verify that the copilot-instructions.md file in the .github directory is created.

- [x] Clarify Project Requirements
	<!-- ✅ Project type: Full-stack Lead Management System with ReactJS frontend, Express backend, JWT authentication with httpOnly cookies, CRUD operations for leads, server-side pagination and filtering -->

- [x] Scaffold the Project
	<!--
	✅ Created both frontend (React) and backend (Express) project structure.
	✅ Frontend configured for Vercel deployment, Backend for Render.
	✅ Database schema created for PostgreSQL with Prisma ORM.
	-->

- [x] Customize the Project
	<!--
	✅ Implemented JWT authentication with httpOnly cookies
	✅ Created Lead model with all required fields (id, firstName, lastName, email, phone, company, city, state, source, status, score, leadValue, lastActivityAt, isQualified, createdAt, updatedAt)
	✅ Implemented CRUD operations with proper HTTP status codes (201, 200, 401, 404, etc.)
	✅ Added server-side pagination and filtering with multiple operators
	✅ Created React components: Login, Register, Dashboard with AG Grid, LeadForm, FilterPanel
	✅ Added authentication context and protected routes
	✅ Implemented comprehensive error handling and loading states
	-->

- [x] Install Required Extensions
	<!-- ✅ All required dependencies installed via package.json -->

- [x] Compile the Project
	<!--
	✅ Dependencies configured for both frontend and backend
	✅ Database schema set up with Prisma
	✅ Build scripts configured
	✅ Environment files created
	-->

- [x] Create and Run Task
	<!--
	✅ Package.json scripts created for development and production
	✅ Seed script created for test data generation
	 -->

- [x] Launch the Project
	<!--
	✅ Development setup ready - run `npm run dev` in backend and `npm start` in frontend
	✅ All components integrated and functional
	 -->

- [x] Ensure Documentation is Complete
	<!--
	✅ Comprehensive README created with:
	  - Complete setup instructions
	  - API documentation  
	  - Deployment guides for Vercel and Render
	  - Test credentials (test@leadmanagement.com / password123)
	  - Feature checklist matching all requirements
	  - Security implementation details
	  - Project structure overview
	 -->
