package kr.co.beauty.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import kr.co.beauty.vo.ProductVO;

@Mapper
@Repository
public interface MainDAO {
	
	public List<ProductVO> selectNewItem();
	public List<ProductVO> selectBestItem(String cate);
	public String countCart(String arg0, String arg1);
	
}
