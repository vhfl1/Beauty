package kr.co.beauty.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import kr.co.beauty.vo.Product1VO;
import kr.co.beauty.vo.ProductOptionVO;

@Repository
public interface AdminDAO {
	public int insertProduct(Product1VO vo);
	public int insertOption(int param1,String param2,String param3,String param4);
	public int updateStock(String arg0, String arg1, String arg2, String arg3);
	public int UpdateTotalStock(String prodNo);
	public List<Product1VO> selectProducts(List<String> collection);
	public List<Product1VO> selectProduct(int arg3);
	public int selectCountProducts(List<String> collection);
	public int deleteProduct(String prodNo);
	public List<Product1VO> searchProduct(String[] arg0, String arg1, String arg2, int arg3);
	public int selectCountTotal();
	public int selectCountProductByKeyword(@Param("param2") String param2,@Param("arg2") String arg2);
	public List<String> selectProductSize(String prodNo);
	public List<String> selectProductColorName(String prodNo);
	public int selectProductSold(String param1,String param2,String param3);
}
