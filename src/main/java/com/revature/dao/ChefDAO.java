package com.revature.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.revature.model.Chef;
import com.revature.util.ConnectionUtil;
import com.revature.util.Page;
import com.revature.util.PageOptions;


// NOTE: This file is part of the backend implementation. No changes are required.


/**
 * Data Access Object (DAO) for performing CRUD operations on Chef entities. This class provides methods to create, read, update, and delete Chef records in the database.
 */
public class ChefDAO {

   /** A utility class for establishing connections to the database. */
   @SuppressWarnings("unused")
   private ConnectionUtil connectionUtil;

   /** Constructs a ChefDAO with the specified ConnectionUtil for database connectivity.
    * 
	 * (FOR REFERENCE) This method is part of the backend logic.
     * No modifications or implementations are required.
    */
   public ChefDAO(ConnectionUtil connectionUtil) {
       this.connectionUtil = connectionUtil;
   }
     /**
     * Retrieves all Chef records from the database. 
     *
     *
	 * (FOR REFERENCE) This method is part of the backend logic.
     * No modifications or implementations are required.
    */
    public List<Chef> getAllChefs() {
        try  {
            Connection connection = connectionUtil.getConnection();
                Statement statement = connection.createStatement();
            String sql = "SELECT * FROM CHEF ORDER BY id";
            ResultSet resultSet = statement.executeQuery(sql);
            return mapRows(resultSet);

        } catch (SQLException e) {
            return null;
        }
    }

    /**
     * Retrieves all Chef records from the database with pagination options.
     *
        /**
	 * (FOR REFERENCE) This method is part of the backend logic.
     * No modifications or implementations are required.
         */
    public Page<Chef> getAllChefs(PageOptions pageOptions) {
        String sql = String.format("SELECT * FROM CHEF ORDER BY %s %s", pageOptions.getSortBy(),
                pageOptions.getSortDirection());
        try {
            Connection connection = connectionUtil.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql);
            ResultSet chefSet = statement.executeQuery();
            return pageResults(chefSet, pageOptions);
        } catch (SQLException e) {
            throw new RuntimeException("Unable to retrieve all chefs", e);
        }
    }

    /**
     * Retrieves a Chef record by its unique identifier.
     *
     /*
	 * (FOR REFERENCE) This method is part of the backend logic.
     * No modifications or implementations are required.
     */
    public Chef getChefById(int id) {
        String sql = "SELECT * FROM CHEF WHERE id = ?";
        try {
            Connection connection = connectionUtil.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql);
            statement.setInt(1, id);
            ResultSet resultSet = statement.executeQuery();
            resultSet.next();
            return mapSingleRow(resultSet);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Creates a new Chef record in the database.
     *
    /**
	 * (FOR REFERENCE) This method is part of the backend logic.
     * No modifications or implementations are required.
 */
    public int createChef(Chef chef) {
        String sql = "INSERT INTO CHEF (username, email, password, is_admin) VALUES (?, ?, ?, ?)";
        try {
            Connection connection = connectionUtil.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, chef.getUsername());
            statement.setString(2, chef.getEmail());
            statement.setString(3, chef.getPassword());
            statement.setBoolean(4, chef.isAdmin());
            int affectedRows = statement.executeUpdate();

            if (affectedRows >= 1) {
                ResultSet generatedKeys = statement.getGeneratedKeys();
                if (generatedKeys.next()) {
                    return generatedKeys.getInt(1);
                }
            }

        } catch (SQLException e) {
           e.printStackTrace();
        }

        return 0;
    }

    /**
     * Updates an existing Chef record in the database.
     *
	 * (FOR REFERENCE) This method is part of the backend logic.
     * No modifications or implementations are required.
     */
    public void updateChef(Chef chef) {
        String sql = "UPDATE CHEF SET username = ?, email = ?, password = ?, is_admin = ? WHERE id = ?";
        try {
            Connection connection = connectionUtil.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, chef.getUsername());
            statement.setString(2, chef.getEmail());
            statement.setString(3, chef.getPassword());
            statement.setBoolean(4, chef.isAdmin());
            statement.setInt(5, chef.getId());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Deletes a Chef record from the database.
     *
	 * (FOR REFERENCE) This method is part of the backend logic.
     * No modifications or implementations are required.
     */
    public void deleteChef(Chef chef) {
        String sql = "DELETE FROM CHEF WHERE id = ?";
        try  {
            Connection connection = connectionUtil.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql);
            statement.setInt(1, chef.getId());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Searches for Chef records by a search term in the username.
     *
	 * (FOR REFERENCE) This method is part of the backend logic.
     * No modifications or implementations are required.
     */
    public List<Chef> searchChefsByTerm(String term) {
        String sql = "SELECT * FROM CHEF WHERE username LIKE ?";
        try  {
            Connection connection = connectionUtil.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, "%" + term + "%");
            ResultSet resultSet = statement.executeQuery();
            return mapRows(resultSet);
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }

    /**
     * Searches for Chef records by a search term in the username with pagination options.
     *
	 * (FOR REFERENCE) This method is part of the backend logic.
     * No modifications or implementations are required.
     */
    public Page<Chef> searchChefsByTerm(String term, PageOptions pageOptions) {
        String sql = String.format("SELECT * FROM CHEF WHERE name LIKE ? ORDER BY %s %s", pageOptions.getSortBy(),
                pageOptions.getSortDirection());
        try{
            Connection connection = connectionUtil.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, "%" + term + "%");
            ResultSet resultSet = statement.executeQuery();
            return pageResults(resultSet, pageOptions);
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }

    // below are helper methods that are included for your convenience

    /**
     * Maps a single row from the ResultSet to a Chef object.
     *
     * No modifications or implementations are required by candidates.
     * 
     * (FOR REFERENCE) This method is part of the backend logic.
     * No modifications or implementations are required.
     */
    private Chef mapSingleRow(ResultSet set) throws SQLException {
        int id = set.getInt("id");
        String username = set.getString("username");
        String email = set.getString("email");
        String password = set.getString("password");
        boolean isAdmin = set.getBoolean("is_admin");
        return new Chef(id, username, email, password, isAdmin);
    }

    /**
     * Maps multiple rows from the ResultSet to a list of Chef objects.
     *
     * No modifications or implementations are required by candidates.
     * 
     * (FOR REFERENCE) This method is part of the backend logic.
     * No modifications or implementations are required.
     */
    private List<Chef> mapRows(ResultSet set) throws SQLException {
        List<Chef> chefs = new ArrayList<>();
        while (set.next()) {
            chefs.add(mapSingleRow(set));
        }
        return chefs;
    }

    /**
     * Paginates the results of a ResultSet into a Page of Chef objects.
     *
     * No modifications or implementations are required by candidates.
     * 
     * (FOR REFERENCE) This method is part of the backend logic.
     * No modifications or implementations are required.
     */
    private Page<Chef> pageResults(ResultSet set, PageOptions pageOptions) throws SQLException {
        List<Chef> chefs = mapRows(set);
        int offset = (pageOptions.getPageNumber() - 1) * pageOptions.getPageSize();
        int limit = offset + pageOptions.getPageSize();
        List<Chef> slicedList = sliceList(chefs, offset, limit);
        return new Page<>(pageOptions.getPageNumber(), pageOptions.getPageSize(),
                chefs.size() / pageOptions.getPageSize(), chefs.size(), slicedList);
    }

    /**
     * Slices a list of Chef objects from a starting index to an ending index.
     *
     * No modifications or implementations are required by candidates.
     * (FOR REFERENCE) This method is part of the backend logic.
     * No modifications or implementations are required.
     */
    private List<Chef> sliceList(List<Chef> list, int start, int end) {
        List<Chef> sliced = new ArrayList<>();
        for (int i = start; i < end; i++) {
            sliced.add(list.get(i));
        }
        return sliced;
    }
}