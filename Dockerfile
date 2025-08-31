# ... (previous build stages)

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy necessary parts from the 'build' stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Copy the original public directory if it contains static assets
COPY --from=build /app/public ./public

# Copy other necessary files like next.config.js, etc. if applicable
# COPY --from=build /app/next.config.js ./next.config.js

CMD ["npm", "start"]
